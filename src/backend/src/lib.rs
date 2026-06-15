mod career;

use candid::{CandidType, Nat};
use ic_cdk_management_canister::{http_request, HttpHeader, HttpMethod, HttpRequestArgs};
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
const CACHE_MAX: usize = 64;
const OPENROUTER_URL: &str = "https://openrouter.ai/api/v1/chat/completions";
const LLM_MODEL: &str = "meta-llama/llama-3.1-8b-instruct";
// Billing uses max_response_bytes, not actual size — keep tight for short answers.
const MAX_RESPONSE_BYTES: u64 = 8_192;

thread_local! {
    static API_KEY: RefCell<String> = RefCell::new(String::new());
    static RATE_WINDOW_START: RefCell<u64> = RefCell::new(0);
    static RATE_CALL_COUNT: RefCell<u32> = RefCell::new(0);
    static RESPONSE_CACHE: RefCell<Vec<(String, String)>> = RefCell::new(Vec::new());
}

// Persist API key across canister upgrades via stable memory.
// Rate limiter and response cache reset on upgrade, which is fine.
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
    allow_fallbacks: bool,
    require_parameters: bool,
}

#[derive(Serialize)]
struct ChatRequest {
    model: String,
    messages: Vec<ChatMessage>,
    max_tokens: u32,
    temperature: f32,
    seed: i32,
    top_p: f32,
    provider: Provider,
}

// ---------------------------------------------------------------------------
// System prompt — instructions + profile knowledge (profile.md)
// ---------------------------------------------------------------------------

const INSTRUCTIONS: &str = "\
You are an AI representative for Aung Myat Kyaw, a Senior DevSecOps Engineer based in Bangkok, Thailand. \
Always refer to him in the third person. Answer only questions about his professional background, \
skills, experience, certifications, education, and portfolio. Do not speculate beyond the profile below.\n\
\n\
Answer style:\n\
- Always reply in clear, natural conversational prose — never mimic terminal, kubectl, shell, or Helm output.\n\
- Do not echo commands, pipe syntax, or fake CLI tables (no whoami, kubectl get, helm ls, command not found, etc.).\n\
- If a visitor phrases a question as a CLI command, infer what they want and answer normally in plain English.\n\
- No markdown unless listing three or more short items; prefer flowing sentences.\n\
\n\
Guardrails:\n\
- Salary / compensation: Never estimate or discuss figures. \
  Say: 'Compensation is best discussed directly with Aung — reach him at aungmyatkyaw.kk@gmail.com.'\n\
- Personal / private topics (age, nationality, relationships, health, politics, religion): \
  Decline politely and redirect to his professional background.\n\
- Off-topic questions (unrelated to his career — weather, recipes, general coding help, other people): \
  Say: 'I can only speak to Aung\\'s professional background — what would you like to know about his skills or experience?'\n\
- Never impersonate Aung or respond as if you are him.\n\
- If the answer is not in the profile, say you do not have that information and suggest contacting Aung.\n\
\n\
Tone: Confident, concise, and professional.\n\
- Simple factual questions: one short sentence in plain English.\n\
- Broader questions: at most 2 short sentences. Lead with the most relevant fact. Never exceed 2 sentences.";

const PROFILE_TEMPLATE: &str = include_str!("../profile.md");

fn build_system_prompt() -> String {
    let now = ic_cdk::api::time();
    let years_plus = career::experience_plus_label(now);
    let current_year = career::current_year(now).to_string();
    let profile = PROFILE_TEMPLATE
        .replace("{{YEARS_EXPERIENCE_PLUS}}", &years_plus)
        .replace("{{CURRENT_YEAR}}", &current_year);
    format!("{}\n\n---\n\n{}", INSTRUCTIONS, profile)
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/// Ask a question about Aung's professional profile.
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

    let cache_key = q_lower.clone();
    if let Some(cached) = cache_get(&cache_key) {
        return AskResult::Ok(cached);
    }

    let seed = stable_hash_i32(&question);
    let body = ChatRequest {
        model: LLM_MODEL.to_string(),
        messages: vec![
            ChatMessage {
                role: "system".to_string(),
                content: build_system_prompt(),
            },
            ChatMessage {
                role: "user".to_string(),
                content: question,
            },
        ],
        // 120 tokens — enough for two full sentences; 60 was truncating broader answers mid-word.
        max_tokens: 120,
        temperature: 0.0,
        seed,
        top_p: 0.0001,
        provider: Provider {
            allow_fallbacks: false,
            require_parameters: true,
        },
    };

    let body_bytes = match serde_json::to_vec(&body) {
        Ok(b) => b,
        Err(e) => return AskResult::Err(format!("Serialization error: {}", e)),
    };

    let headers = vec![
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
    ];

    match http_post_json(OPENROUTER_URL.to_string(), headers, body_bytes, MAX_RESPONSE_BYTES).await {
        Ok(response_body) => match parse_openrouter_response(response_body) {
            AskResult::Ok(answer) => {
                cache_put(cache_key, answer.clone());
                AskResult::Ok(answer)
            }
            err => err,
        },
        Err(msg) => AskResult::Err(msg),
    }
}

/// Set the OpenRouter API key. Only callable by the canister controller.
#[ic_cdk::update]
fn set_api_key(key: String) {
    let caller = ic_cdk::api::msg_caller();
    if !ic_cdk::api::is_controller(&caller) {
        ic_cdk::trap("Unauthorized: only controllers can set the API key");
    }
    API_KEY.with(|k| *k.borrow_mut() = key);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async fn http_post_json(
    url: String,
    headers: Vec<HttpHeader>,
    body: Vec<u8>,
    max_response_bytes: u64,
) -> Result<Vec<u8>, String> {
    let request = HttpRequestArgs {
        url,
        max_response_bytes: Some(max_response_bytes),
        method: HttpMethod::POST,
        headers,
        body: Some(body),
        transform: None,
        is_replicated: Some(false),
    };

    let response = http_request(&request)
        .await
        .map_err(|e| format!("HTTP outcall failed: {:?}", e))?;

    if response.status == Nat::from(429u32) {
        return Err("Rate limited by AI provider. Please try again shortly.".to_string());
    }
    if response.status > Nat::from(399u32) {
        return Err(format!("Upstream HTTP {}", response.status));
    }

    Ok(response.body)
}

/// Stable 32-bit seed derived from the question for reproducible LLM output.
fn stable_hash_i32(text: &str) -> i32 {
    let mut hash: u32 = 0x811c9dc5;
    for byte in text.bytes() {
        hash ^= u32::from(byte);
        hash = hash.wrapping_mul(0x01000193);
    }
    (hash & 0x7fffffff) as i32
}

fn cache_get(key: &str) -> Option<String> {
    RESPONSE_CACHE.with(|cache| {
        cache
            .borrow()
            .iter()
            .find(|(k, _)| k == key)
            .map(|(_, v)| v.clone())
    })
}

fn cache_put(key: String, value: String) {
    RESPONSE_CACHE.with(|cache| {
        let mut entries = cache.borrow_mut();
        if let Some(pos) = entries.iter().position(|(k, _)| k == &key) {
            entries[pos] = (key, value);
            return;
        }
        if entries.len() >= CACHE_MAX {
            entries.remove(0);
        }
        entries.push((key, value));
    });
}

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

    AskResult::Err(format!(
        "Unexpected response: {}",
        &body_str[..body_str.len().min(200)]
    ))
}

// Auto-generate the Candid interface from annotated functions
ic_cdk::export_candid!();
