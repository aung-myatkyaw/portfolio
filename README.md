# Portfolio Website — Aung Myat Kyaw

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![ICP](https://img.shields.io/badge/deployed-Internet%20Computer-29abe2)](https://aungmyatkyaw.cv)
[![Live](https://img.shields.io/badge/site-aungmyatkyaw.cv-green)](https://aungmyatkyaw.cv)

A modern, responsive portfolio website for a Senior DevSecOps Engineer, featuring an **AI "Ask About Me" agent** powered by a Rust canister on the Internet Computer (ICP) blockchain.

**Live site:** [aungmyatkyaw.cv](https://aungmyatkyaw.cv) | [www.aungmyatkyaw.cv](https://www.aungmyatkyaw.cv)

> Open source under the [MIT License](LICENSE). You are welcome to fork and adapt this project — please keep the license notice and replace personal content (bio, contact details, canister IDs, domain) with your own.

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
  - Rust backend canister on ICP making non-replicated HTTPS outcalls to OpenRouter
  - `meta-llama/llama-3.1-8b-instruct` with factual, short responses
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
| AI Agent (backend) | Rust canister on ICP, non-replicated HTTPS outcalls to OpenRouter |
| AI Model | `meta-llama/llama-3.1-8b-instruct` via OpenRouter |
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
| `VITE_BACKEND_CANISTER_ID` | Backend canister ID | **Local dev only** — mainnet uses `ic_env` cookie from icp-cli |

Copy [`.env.example`](.env.example) to `.env.production` (EmailJS/Turnstile for mainnet builds) or `.env.local` (local overrides). Destination files are gitignored.

On mainnet, **icp-cli injects** `PUBLIC_CANISTER_ID:backend` at deploy time; the portfolio asset canister exposes it via the `ic_env` cookie. The frontend reads it with `safeGetCanisterEnv()` — no build-time canister ID needed in CI.

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

# 3. Deploy the frontend (icp-cli injects canister IDs into the asset canister ic_env cookie)
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

### GitHub Actions (CI/CD)

Pushes to `main` that touch deploy-related paths run [`.github/workflows/icp-deploy.yml`](.github/workflows/icp-deploy.yml) to build and deploy both canisters to mainnet. Docs-only changes (e.g. `README.md`) do not trigger a deploy. You can also trigger a manual run from the **Actions** tab (`workflow_dispatch`).

**Repository secrets** (Settings → Secrets and variables → Actions):

| Secret | Required | Purpose |
|---|---|---|
| `ICP_IDENTITY_PEM` | Yes | Mainnet deploy identity PEM (`icp identity export personal`) |
| `OPENROUTER_API_KEY` | Recommended | Passed to `set_api_key` after each backend deploy; omit only if the key is already in stable memory and you never rotate it |
| `VITE_EMAILJS_SERVICE_ID` | Yes | Contact form build |
| `VITE_EMAILJS_TEMPLATE_ID` | Yes | Contact form build |
| `VITE_EMAILJS_PUBLIC_KEY` | Yes | Contact form build |
| `VITE_TURNSTILE_SITE_KEY` | Yes | Turnstile widget (site key only) |

**Repository variables** (optional):

| Variable | Default | Purpose |
|---|---|---|
| `ICP_IDENTITY_NAME` | `personal` | ICP identity used for `icp deploy` (`icp identity export <name>`) |
| `ICP_CLI_VERSION` | `1.0.2` | `@icp-sdk/icp-cli` npm version to install in CI |
| `NODE_VERSION` | `22` | Node.js version for `setup-node` and `npm ci` |
| `ICP_DEPLOY_MODE` | `full` | `full` = `icp deploy portfolio`; `sync` = asset-only `icp sync portfolio` (cheaper for frontend-only changes) |
| `ICP_CUSTOM_DOMAINS` | _(unset)_ | Comma-separated domains to validate/register after deploy, e.g. `aungmyatkyaw.cv,www.aungmyatkyaw.cv` |

`VITE_BACKEND_CANISTER_ID` is not needed in CI — icp-cli injects canister IDs at deploy time and the frontend reads them from the `ic_env` cookie.

**Personal vs organization repos:** GitHub Actions works the same on both. For a **public** personal repo, Actions minutes are **unlimited and free**. On **private** repos, personal accounts include ~2,000 free minutes/month. Organization repos use the org's quota and may require an admin to enable Actions or approve third-party workflow actions — but the workflow itself does not need AWS, reusable workflows, or org-level infrastructure.

### Canister IDs

Mainnet IDs are stored in `.icp/data/mappings/ic.ids.json` (committed — ICP CLI reads this on deploy):

```json
{
  "backend": "2h2bb-wiaaa-aaaal-qwnna-cai",
  "portfolio": "trwm2-7aaaa-aaaal-qwm6q-cai"
}
```

After creating new canisters, run `icp deploy -e ic` and commit the updated `.icp/data/` mappings.

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

Natural-language answers only — no terminal or kubectl-style output, even if the visitor phrases a question as a shell command.

---

## Custom Domain Setup

This site is served at [aungmyatkyaw.cv](https://aungmyatkyaw.cv) and [www.aungmyatkyaw.cv](https://www.aungmyatkyaw.cv) via the [ICP HTTP gateway custom domain service](https://docs.internetcomputer.org/guides/frontends/custom-domains/). The service provisions TLS certificates and routes traffic to the asset canister automatically.

**Portfolio asset canister:** `trwm2-7aaaa-aaaal-qwm6q-cai`

### Prerequisites

- A registered domain with DNS access
- The `portfolio` asset canister deployed to mainnet
- `curl` and `jq` for the registration API

### Step 1: DNS records

Register **each hostname separately** (apex and `www` each need their own three records). Replace `CUSTOM_DOMAIN` with your domain when adapting these steps.

| Record type | Host | Value |
|---|---|---|
| `CNAME` or `ALIAS` | `CUSTOM_DOMAIN` | `CUSTOM_DOMAIN.icp1.io` |
| `TXT` | `_canister-id.CUSTOM_DOMAIN` | `trwm2-7aaaa-aaaal-qwm6q-cai` |
| `CNAME` | `_acme-challenge.CUSTOM_DOMAIN` | `_acme-challenge.CUSTOM_DOMAIN.icp2.io` |

**This project (Cloudflare — DNS only, not proxied):**

| Type | Name | Value |
|---|---|---|
| `CNAME` or `ALIAS` | `aungmyatkyaw.cv` | `aungmyatkyaw.cv.icp1.io` |
| `TXT` | `_canister-id.aungmyatkyaw.cv` | `trwm2-7aaaa-aaaal-qwm6q-cai` |
| `CNAME` | `_acme-challenge.aungmyatkyaw.cv` | `_acme-challenge.aungmyatkyaw.cv.icp2.io` |
| `CNAME` | `www.aungmyatkyaw.cv` | `www.aungmyatkyaw.cv.icp1.io` |
| `TXT` | `_canister-id.www.aungmyatkyaw.cv` | `trwm2-7aaaa-aaaal-qwm6q-cai` |
| `CNAME` | `_acme-challenge.www.aungmyatkyaw.cv` | `_acme-challenge.www.aungmyatkyaw.cv.icp2.io` |

> **Cloudflare:** Disable **Universal SSL** (SSL/TLS → Edge Certificates) and set records to **DNS only** (grey cloud). Proxied mode and Universal SSL interfere with ICP's ACME certificate challenge.
>
> **Apex domains:** Some registrars require `ALIAS`/`ANAME` instead of `CNAME` on the apex. Cloudflare supports CNAME flattening on the apex.

### Step 2: Domain ownership file

The canister must serve `/.well-known/ic-domains` listing every hostname you register. This repo already includes it:

```
public/.well-known/ic-domains
```

```text
aungmyatkyaw.cv
www.aungmyatkyaw.cv
```

Hidden directories are excluded by default — `public/.ic-assets.json5` includes `{ "match": ".well-known", "ignore": false }` so the file is deployed.

### Step 3: Deploy the asset canister

```bash
icp deploy portfolio -e ic
```

Verify the ownership file is live:

```bash
curl -sL https://trwm2-7aaaa-aaaal-qwm6q-cai.icp.net/.well-known/ic-domains
```

### Step 4: Validate (recommended)

Check DNS and canister ownership before registering:

```bash
curl -sL -X GET "https://icp.net/custom-domains/v1/aungmyatkyaw.cv/validate" | jq
curl -sL -X GET "https://icp.net/custom-domains/v1/www.aungmyatkyaw.cv/validate" | jq
```

A successful response has `"validation_status": "valid"`. If validation fails, see the [troubleshooting table](https://docs.internetcomputer.org/guides/frontends/custom-domains/#step-4-validate-your-configuration-recommended) in the official docs.

### Step 5: Register

```bash
curl -sL -X POST "https://icp.net/custom-domains/v1/aungmyatkyaw.cv" | jq
curl -sL -X POST "https://icp.net/custom-domains/v1/www.aungmyatkyaw.cv" | jq
```

### Step 6: Wait for certificate provisioning

Poll until `registration_status` is `registered` (usually a few minutes, then allow 5–10 minutes for gateway propagation):

```bash
curl -sL -X GET "https://icp.net/custom-domains/v1/aungmyatkyaw.cv" | jq
curl -sL -X GET "https://icp.net/custom-domains/v1/www.aungmyatkyaw.cv" | jq
```

| `registration_status` | Meaning |
|---|---|
| `registering` | Certificate provisioning in progress |
| `registered` | Domain is live |
| `failed` | Check the error message; re-validate DNS and retry |
| `expired` | Re-register with `POST` |

### Updating or removing a domain

- **Point at a different canister:** update the `_canister-id` TXT record, then `PATCH https://icp.net/custom-domains/v1/CUSTOM_DOMAIN`
- **Remove:** delete the `_canister-id` TXT and `_acme-challenge` CNAME records, then `DELETE https://icp.net/custom-domains/v1/CUSTOM_DOMAIN`

See [Updating](https://docs.internetcomputer.org/guides/frontends/custom-domains/#updating-a-custom-domain) and [Removing](https://docs.internetcomputer.org/guides/frontends/custom-domains/#removing-a-custom-domain) in the official docs.

### HttpAgent on custom domains

When the frontend runs on a custom domain, `HttpAgent` must not use the page origin as the IC API host. This project sets `host: 'https://icp-api.io'` on mainnet in `src/lib/askMeActor.js`. Backend canister ID comes from the `ic_env` cookie (`PUBLIC_CANISTER_ID:backend`), not from a Vite env var.

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

---

## Project structure

```
portfolio/
├── src/                    # React frontend
│   ├── backend/            # Rust canister (AI agent)
│   ├── components/         # UI components
│   └── lib/                # ICP agent, career helpers
├── public/                 # Static assets, CSP, ic-domains
├── icp.yaml                # ICP CLI canister definitions
├── .icp/data/              # ICP CLI canister ID mappings (ic.ids.json)
└── .github/workflows/      # Mainnet deploy on push to main
```

---

## License

This project is licensed under the [MIT License](LICENSE).

Copyright © 2026 [Aung Myat Kyaw](https://aungmyatkyaw.cv).

Third-party services (EmailJS, Cloudflare Turnstile, OpenRouter) are subject to their own terms. Canister deployment and cycles on the Internet Computer require a separate ICP identity and funding.
