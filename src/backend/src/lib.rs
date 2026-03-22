use candid::CandidType;
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse,
    TransformArgs, TransformContext,
};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

// 30 calls per 5-minute window globally — prevents cycle drain from bots
// that bypass the frontend. All unauthenticated ICP callers share the same
// anonymous principal, so per-caller limiting isn't meaningful here.
const RATE_LIMIT_WINDOW_NS: u64 = 300_000_000_000; // 5 minutes in nanoseconds
const RATE_LIMIT_MAX_CALLS: u32 = 30;

thread_local! {
    static API_KEY: RefCell<String> = RefCell::new(String::new());
    static RATE_WINDOW_START: RefCell<u64> = RefCell::new(0);
    static RATE_CALL_COUNT: RefCell<u32> = RefCell::new(0);
}

// Persist API key across canister upgrades via stable memory.
// Rate limiter state is intentionally not saved — it resets on upgrade which is fine.
#[ic_cdk::pre_upgrade]
fn pre_upgrade() {
    let key = API_KEY.with(|k| k.borrow().clone());
    ic_cdk::storage::stable_save((key,)).expect("Failed to save API key to stable memory");
}

#[ic_cdk::post_upgrade]
fn post_upgrade() {
    if let Ok((key,)) = ic_cdk::storage::stable_restore::<(String,)>() {
        API_KEY.with(|k| *k.borrow_mut() = key);
    }
}

// Phrases that signal prompt injection — never appear in genuine questions
// about a person's professional background.
const INJECTION_PATTERNS: &[&str] = &[
    "ignore previous",
    "ignore all",
    "ignore your",
    "forget your",
    "forget previous",
    "disregard your",
    "override your",
    "override instructions",
    "new instructions",
    "you are now",
    "act as if",
    "pretend you are",
    "pretend to be",
    "jailbreak",
    "prompt injection",
    "system prompt",
    "new persona",
    "roleplay as",
    "reveal your instructions",
    "show me your prompt",
    "what is your system",
    "print your instructions",
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

#[derive(CandidType, Deserialize)]
enum AskResult {
    Ok(String),
    Err(String),
}

#[derive(Serialize)]
struct ChatMessage {
    role: String,
    content: String,
}

#[derive(Serialize)]
struct Provider {
    // Pin to a single inference provider so all 13 ICP subnet nodes hit the same
    // backend and get byte-identical responses at temperature=0 for consensus.
    only: Vec<String>,
    allow_fallbacks: bool,
}

#[derive(Serialize)]
struct ChatRequest {
    model: String,
    messages: Vec<ChatMessage>,
    max_tokens: u32,
    temperature: f32,
    // seed + temperature=0 + top_p≈0 = greedy decoding, maximising cross-GPU determinism.
    // All 13 ICP subnet nodes independently call the model and must agree on the response.
    // Shorter outputs have fewer token-branch divergence points → higher consensus rate.
    seed: u32,
    top_p: f32,
    provider: Provider,
}

// ---------------------------------------------------------------------------
// System prompt — Aung's professional profile
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT: &str = "\
You are an AI representative for Aung, a Senior DevSecOps Engineer based in Bangkok, Thailand. \
Always refer to him in the third person. Answer only questions about his professional background, \
skills, experience, and certifications. Do not speculate beyond the facts below.\n\
\n\
Guardrails:\n\
- Salary / compensation: Never estimate or discuss figures. \
  Say: 'Compensation is best discussed directly with Aung — reach him at aungmyatkyaw.kk@gmail.com.'\n\
- Personal / private topics (age, nationality, relationships, health, politics, religion): \
  Decline politely and redirect to his professional background.\n\
- Off-topic questions: Say: 'I can only speak to Aung\\'s professional background — \
  what would you like to know about his skills or experience?'\n\
- Never impersonate Aung or respond as if you are him.\n\
\n\
Profile:\n\
- Total experience: 6 years (2020 - 2026). State this exactly; do not recalculate.\n\
- Current: Senior DevSecOps Engineer at General Magick Industries (May 2024 – present). \
  Architects secure multicloud infrastructure for agentic AI applications, embeds security scanning \
  into CI/CD pipelines, and orchestrates containerised AI/GPU workloads on Kubernetes.\n\
- Yoma Bank — DevOps Engineer (Nov 2022 – Feb 2024): Built GitLab CI/CD pipelines automating \
  the full microservices lifecycle for one of Myanmar\\'s largest banks.\n\
- Karzo Myanmar — DevOps Engineer (Mar 2022 – Nov 2022): Owned the end-to-end DevOps toolchain \
  for a logistics startup — deployments, VM provisioning, and system integration testing.\n\
- Global Wave Technology — Junior DevOps / Developer (May 2020 – Feb 2022): Began as a full-stack \
  developer (Xamarin, Angular, .NET, MySQL) then transitioned into DevOps.\n\
- Certifications: CKS (Certified Kubernetes Security Specialist) and CKA (Certified Kubernetes \
  Administrator) from The Linux Foundation; AWS Certified SysOps Administrator – Associate from AWS.\n\
- Skills by domain:\n\
    Kubernetes & orchestration: Kubernetes, Helm, Istio, Rancher, Karpenter\n\
    Cloud & IaC: AWS, Terraform, Cloud Security\n\
    CI/CD & DevSecOps: GitHub Actions, GitLab CI/CD, SonarQube, OWASP LLM Top 10\n\
    Observability: Prometheus, Grafana, Docker\n\
    AI infrastructure: LiteLLM, MLOps Pipelines, GPU Workload Orchestration, AI Infrastructure\n\
    Scripting: Python, Bash\n\
    Other: ICP (Internet Computer Protocol), OSS integration and deployment\n\
- Open to: Senior DevSecOps, AI Infrastructure, or Platform Engineering roles — ideally at AI-first companies.\n\
- Contact: aungmyatkyaw.kk@gmail.com | linkedin.com/in/aung-myat-kyaw\n\
\n\
Tone: Confident, concise, and professional. Answer in exactly 2 short sentences. Lead with the most relevant fact. Never exceed 2 sentences.";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/// Ask a question about Aung's professional profile.
/// Uses openrouter/auto — OpenRouter picks whichever free model is available.
#[ic_cdk::update]
async fn ask_about_me(question: String) -> AskResult {
    let api_key = API_KEY.with(|k| k.borrow().clone());

    if api_key.is_empty() {
        return AskResult::Err("AI service is not yet configured. Please check back soon.".to_string());
    }

    // --- Rate limiting ---
    let now = ic_cdk::api::time();
    let limited = RATE_WINDOW_START.with(|start| {
        RATE_CALL_COUNT.with(|count| {
            let mut s = start.borrow_mut();
            let mut c = count.borrow_mut();
            if now.saturating_sub(*s) > RATE_LIMIT_WINDOW_NS {
                *s = now;
                *c = 1;
                false
            } else if *c >= RATE_LIMIT_MAX_CALLS {
                true
            } else {
                *c += 1;
                false
            }
        })
    });
    if limited {
        return AskResult::Err("Too many requests. Please try again in a few minutes.".to_string());
    }

    // --- Input validation ---
    let question = question.trim().to_string();
    if question.is_empty() {
        return AskResult::Err("Please enter a question.".to_string());
    }
    if question.len() > 300 {
        return AskResult::Err("Question is too long. Please keep it under 300 characters.".to_string());
    }

    // --- Prompt injection guard ---
    let q_lower = question.to_lowercase();
    if INJECTION_PATTERNS.iter().any(|p| q_lower.contains(p)) {
        return AskResult::Err("Your message was flagged as a potential prompt injection attempt.".to_string());
    }

    let body = ChatRequest {
        // Pinned to a specific model — ICP HTTPS outcalls require all 13 subnet nodes
        // to independently call OpenRouter and reach consensus on the response.
        // Using openrouter/auto or openrouter/free risks different nodes getting routed
        // to different models, producing different response bodies and breaking consensus.
        model: "meta-llama/llama-3.1-8b-instruct".to_string(),
        messages: vec![
            ChatMessage { role: "system".to_string(), content: SYSTEM_PROMPT.to_string() },
            ChatMessage { role: "user".to_string(),   content: question },
        ],
        // 600 tokens — reasoning tokens eat into this budget, so we need headroom
        // to ensure the actual answer isn't cut off mid-sentence.
        max_tokens: 80,
        temperature: 0.0,
        seed: 42,
        top_p: 0.0001,
        provider: Provider {
            only: vec!["deepinfra/bf16".to_string()],
            allow_fallbacks: false,
        },
    };

    let body_bytes = match serde_json::to_vec(&body) {
        Ok(b) => b,
        Err(e) => return AskResult::Err(format!("Serialization error: {}", e)),
    };

    let request = CanisterHttpRequestArgument {
        url: "https://openrouter.ai/api/v1/chat/completions".to_string(),
        method: HttpMethod::POST,
        headers: vec![
            HttpHeader {
                name: "Authorization".to_string(),
                value: format!("Bearer {}", api_key),
            },
            HttpHeader {
                name: "Content-Type".to_string(),
                value: "application/json".to_string(),
            },
            HttpHeader {
                name: "HTTP-Referer".to_string(),
                value: "https://aungmyatkyaw.cv".to_string(),
            },
        ],
        body: Some(body_bytes),
        transform: Some(TransformContext::from_name(
            "transform_response".to_string(),
            vec![],
        )),
        // 8KB — sufficient for LLaMA 3.1 8B responses (observed: ~200 bytes / 34 tokens).
        // Reducing from 24KB saves ~166M ICP cycles per call (10,400 cycles/byte × 16KB).
        max_response_bytes: Some(8_192),
    };

    // Actual cost breakdown (13-node subnet):
    //   base_fee = 49M | request_bytes ~16M | response_bytes (24KB) ~256M | overhead ~10M ≈ 331M
    //   500M attached gives ~169M buffer. See: https://docs.internetcomputer.org/references/cycles-cost-formulas
    match http_request(request, 500_000_000).await {
        Ok((response,)) => parse_openrouter_response(response.body),
        Err((_, msg)) => AskResult::Err(format!("HTTP outcall failed: {}", msg)),
    }
}

/// Set the OpenRouter API key. Only callable by the canister controller.
#[ic_cdk::update]
fn set_api_key(key: String) {
    let caller = ic_cdk::caller();
    if !ic_cdk::api::is_controller(&caller) {
        ic_cdk::trap("Unauthorized: only controllers can set the API key");
    }
    API_KEY.with(|k| *k.borrow_mut() = key);
}

/// Normalize the OpenRouter response so all 13 subnet nodes produce byte-identical output.
///
/// Two sources of non-determinism must be stripped:
///   1. HTTP headers (Date, X-Request-Id, CF-Ray, etc.) — vary per node's request
///   2. Response body fields (id, created, system_fingerprint) — unique per API call
///
/// We rebuild the body keeping only the fields needed for consensus:
/// choices[].message.content and error. Everything else is discarded.
#[ic_cdk::query]
fn transform_response(args: TransformArgs) -> HttpResponse {
    let body = match String::from_utf8(args.response.body) {
        Ok(body_str) => match serde_json::from_str::<serde_json::Value>(&body_str) {
            Ok(json) => {
                let clean = serde_json::json!({
                    "choices": json["choices"],
                    "error": json["error"]
                });
                clean.to_string().into_bytes()
            }
            Err(_) => body_str.into_bytes(),
        },
        Err(e) => e.into_bytes(),
    };

    HttpResponse {
        status: args.response.status,
        body,
        headers: vec![],
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn parse_openrouter_response(body: Vec<u8>) -> AskResult {
    let body_str = match String::from_utf8(body) {
        Ok(s) => s,
        Err(_) => return AskResult::Err("Invalid UTF-8 in response".to_string()),
    };

    let json: serde_json::Value = match serde_json::from_str(&body_str) {
        Ok(v) => v,
        Err(_) => return AskResult::Err("Failed to parse JSON response".to_string()),
    };

    if let Some(content) = json["choices"][0]["message"]["content"].as_str() {
        return AskResult::Ok(content.trim().to_string());
    }

    if let Some(err_msg) = json["error"]["message"].as_str() {
        return AskResult::Err(err_msg.to_string());
    }

    AskResult::Err(format!("Unexpected response: {}", &body_str[..body_str.len().min(200)]))
}

// Auto-generate the Candid interface from annotated functions
ic_cdk::export_candid!();
