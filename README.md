# Portfolio Website — Aung Myat Kyaw

A modern, responsive portfolio website for a Senior DevSecOps Engineer, featuring an **AI "Ask About Me" agent** powered by a Rust canister on the Internet Computer (ICP) blockchain.

**Live site:** [aungmyatkyaw.cv](https://aungmyatkyaw.cv) | [www.aungmyatkyaw.cv](https://www.aungmyatkyaw.cv)

| Canister | ID | Link |
|---|---|---|
| Frontend (asset canister) | `trwm2-7aaaa-aaaal-qwm6q-cai` | [icp0.io](https://trwm2-7aaaa-aaaal-qwm6q-cai.icp0.io) |
| Backend (Rust canister) | `2h2bb-wiaaa-aaaal-qwnna-cai` | [Candid UI](https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=2h2bb-wiaaa-aaaal-qwnna-cai) |

---

## Features

- Cyber Dark theme with default dark mode
- Fully responsive, smooth page transitions (Framer Motion)
- Contact form with EmailJS, Cloudflare Turnstile anti-spam, and honeypot protection
- **AI "Ask About Me" agent** embedded in the Contact page:
  - Rust backend canister on ICP making HTTPS outcalls to OpenRouter
  - `openrouter/auto` model with `reasoning: { effort: "minimal" }`
  - Global rate limiter (30 calls / 5 min) to prevent cycle drain attacks
  - Prompt injection guard (22-pattern blocklist)
  - API key persisted to stable memory across canister upgrades
  - Input length validation (300 char max, enforced on both frontend and backend)
- Hardened HTTP security headers (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy)
- Brotli + Gzip compression via `vite-plugin-compression2`
- Vendor chunk splitting for optimised load times
- Deployed on ICP as asset + Rust canisters on the same subnet

---

## Tech Stack

| Category | Tools |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Routing | React Router DOM |
| Email | EmailJS (`@emailjs/browser`) |
| Anti-spam | Cloudflare Turnstile + Honeypot |
| Icons | React Icons |
| AI Agent (frontend) | `@dfinity/agent` — calls Rust backend canister |
| AI Agent (backend) | Rust canister on ICP, HTTPS outcalls to OpenRouter |
| AI Model | `openrouter/auto` (free tier, auto-routed) |
| Deployment | Internet Computer (ICP) — ICP CLI |
| Compression | vite-plugin-compression2 (Brotli + Gzip) |

---

## Local Development

### Frontend only

```bash
npm install
npm run dev
```

### Full stack (frontend + backend canister)

Requires [Rust](https://rustup.rs/) with the `wasm32-unknown-unknown` target and [ICP CLI](https://cli.internetcomputer.org/):

```bash
rustup target add wasm32-unknown-unknown
cargo install cargo-audit   # optional: vulnerability scanning

# Start local ICP network
icp network start -d

# Deploy both canisters locally
icp deploy

# Set the OpenRouter API key on the local backend canister
icp canister call backend set_api_key '("your-openrouter-api-key")'
```

The local ICP network runs at `http://localhost:4943`. The frontend auto-detects local vs. mainnet at runtime via `window.location.hostname`.

### Environment variables

| Variable | Description | Required for |
|---|---|---|
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID | Contact form |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID | Contact form |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | Contact form |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key | Anti-spam |
| `VITE_BACKEND_CANISTER_ID` | ICP backend canister ID | AI agent |

Set in `.env.production` for mainnet builds, `.env.local` for local overrides. Both are gitignored.

---

## ICP Deployment

### Prerequisites

- `icp` CLI installed
- Rust + `wasm32-unknown-unknown` target
- ICP identity with sufficient cycles (see cost table below)

### First-time mainnet deployment

```bash
# 1. Deploy backend canister on mainnet with an initial cycles balance
icp deploy backend -e ic --cycles 1t

# 2. Set the OpenRouter API key (one-time; persisted to stable memory across upgrades)
icp canister call backend set_api_key '("your-openrouter-api-key")' -e ic

# 3. Update VITE_BACKEND_CANISTER_ID in .env.production with the new mainnet canister ID

# 4. Deploy the frontend with the updated env
icp deploy portfolio -e ic
```

### Subsequent deployments (upgrade)

```bash
# Backend upgrade — API key is preserved via pre_upgrade/post_upgrade hooks
icp deploy backend -e ic

# Frontend redeploy
icp deploy portfolio -e ic

# Or redeploy everything at once
icp deploy -e ic
```

### Canister IDs

Mainnet IDs are stored in two places for CLI compatibility:

| File | Used by |
|---|---|
| `canister_ids.json` | Legacy `dfx` commands |
| `.icp/data/mappings/.ids.json` | ICP CLI (`icp deploy`, etc.) |

```json
{
  "backend": {
    "ic": "2h2bb-wiaaa-aaaal-qwnna-cai"
  },
  "portfolio": {
    "ic": "trwm2-7aaaa-aaaal-qwm6q-cai"
  }
}
```

Keep both files in sync when deploying new canisters. Commit `.icp/data/` to preserve ICP CLI mappings.

### Cycles cost reference

| Operation | Cost |
|---|---|
| Canister creation (one-time, deducted from initial balance) | 0.5 TC |
| `ask_about_me` HTTPS outcall (non-replicated, ~3KB request + 8KB max response) | ~30M cycles |
| `ask_about_me` cache hit (repeat question) | 0 (no outcall) |
| Frontend redeploy (Wasm install) | ~0.01–0.05 TC |
| Idle storage (1.7MB Rust canister) | ~24M cycles/day |
| **Recommended initial backend balance** | **1 TC** (leaves ~0.5 TC after creation fee → ~15,000+ questions) |

> 1 TC = 1 trillion cycles ≈ $1.35 USD. See [ICP cycles cost formulas](https://docs.internetcomputer.org/references/cycles-cost-formulas#cycles-price-breakdown) for exact calculations.

Monitor balance:

```bash
icp canister status backend -e ic
```

---

## AI Agent — Architecture

```
Browser (React)
  └── @dfinity/agent
        └── ICP backend canister (Rust) — 2h2bb-wiaaa-aaaal-qwnna-cai
              └── non-replicated HTTPS outcall → openrouter.ai/api/v1/chat/completions
                    └── meta-llama/llama-3.1-8b-instruct
```

### Security measures on the backend canister

| Measure | Detail |
|---|---|
| Rate limiting | Global 30 calls / 5-minute window — prevents cycle drain from bots |
| Input validation | Empty and >300 char questions rejected before burning cycles |
| Prompt injection guard | 22-pattern blocklist checked before OpenRouter call |
| API key protection | `set_api_key` restricted to canister controllers only |
| Stable memory persistence | API key survives canister upgrades via `pre_upgrade`/`post_upgrade` hooks |
| Non-replicated outcalls | `is_replicated: false` — one subnet node calls OpenRouter (no 13× fan-out or consensus transform) |
| Response cache | LRU cache (64 entries) — repeat questions skip the outcall entirely |
| Response size cap | `max_response_bytes: 8KB` — cycles billed on cap, not actual size |

### System prompt guardrails

The AI agent will not answer:
- Salary / compensation questions (redirects to direct contact)
- Personal / private questions (age, nationality, etc.)
- Off-topic questions unrelated to professional background

CLI-style commands (e.g. `kubectl get certs`, `whoami`, `cat role.txt`) are treated as on-topic and answered with short terminal-style output.

---

## Custom Domain Setup

Domains registered via the ICP HTTP gateway custom domain service:

- `aungmyatkyaw.cv`
- `www.aungmyatkyaw.cv`

### DNS Records (Cloudflare — DNS only, not proxied)

| Type | Name | Value |
|---|---|---|
| CNAME | `aungmyatkyaw.cv` | `aungmyatkyaw.cv.icp1.io` |
| TXT | `_canister-id.aungmyatkyaw.cv` | `trwm2-7aaaa-aaaal-qwm6q-cai` |
| CNAME | `_acme-challenge.aungmyatkyaw.cv` | `_acme-challenge.aungmyatkyaw.cv.icp2.io` |
| CNAME | `www.aungmyatkyaw.cv` | `www.aungmyatkyaw.cv.icp1.io` |
| TXT | `_canister-id.www.aungmyatkyaw.cv` | `trwm2-7aaaa-aaaal-qwm6q-cai` |
| CNAME | `_acme-challenge.www.aungmyatkyaw.cv` | `_acme-challenge.www.aungmyatkyaw.cv.icp2.io` |

### Register / check domain status

```bash
curl -sL -X POST https://icp0.io/custom-domains/v1/aungmyatkyaw.cv | jq
curl -sL -X POST https://icp0.io/custom-domains/v1/www.aungmyatkyaw.cv | jq

curl -sL -X GET https://icp0.io/custom-domains/v1/aungmyatkyaw.cv | jq
curl -sL -X GET https://icp0.io/custom-domains/v1/www.aungmyatkyaw.cv | jq
```

---

## Asset Security Policy (`public/.ic-assets.json5`)

| Header | Value |
|---|---|
| `Content-Security-Policy` | Strict CSP (see below) |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()` |

### CSP directive allowlist

| Directive | Allowed origins |
|---|---|
| `script-src` | `'self'`, `'unsafe-inline'`, `'unsafe-eval'`, `https://challenges.cloudflare.com` |
| `frame-src` | `https://challenges.cloudflare.com` |
| `frame-ancestors` | `'none'` (clickjacking prevention) |
| `connect-src` | `'self'`, `https://api.emailjs.com`, `https://icp-api.io`, `https://openrouter.ai`, `http://localhost:4943` |
| `style-src` | `'self'`, `'unsafe-inline'` |
| `img-src` | `'self'`, `data:` |
| `font-src` | `'self'`, `data:` (JetBrains Mono bundled via `@fontsource/jetbrains-mono`) |
