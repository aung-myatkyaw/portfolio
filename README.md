# Portfolio Website — Aung Myat Kyaw

A modern, responsive portfolio website showcasing my experience as a Senior DevSecOps Engineer, with a focus on secure AI infrastructure and cloud-native engineering.

**Live site:** [aungmyatkyaw.cv](https://aungmyatkyaw.cv) | [www.aungmyatkyaw.cv](https://www.aungmyatkyaw.cv)

**ICP Canister:** `trwm2-7aaaa-aaaal-qwm6q-cai` ([raw URL](https://trwm2-7aaaa-aaaal-qwm6q-cai.icp0.io))

---

## Features

- Modern UI with Cyber Dark theme (default dark mode)
- Fully responsive design
- Smooth page transitions with Framer Motion
- Contact form with EmailJS integration
- Cloudflare Turnstile anti-spam + honeypot protection
- Interactive skill ratings and scroll progress indicator
- SEO optimized with Open Graph meta tags
- Deployed on the Internet Computer (ICP) blockchain as an asset canister
- Custom domain with automatic SSL via ICP HTTP gateways
- Brotli + Gzip compression via `vite-plugin-compression2`
- Vendor chunk splitting for optimized load times

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
| Deployment | Internet Computer (ICP) — DFX asset canister |
| Compression | vite-plugin-compression2 (Brotli + Gzip) |

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build -- --mode production
```

Environment variables are loaded from `.env.production` during production builds. Copy `.env.example` (if present) or create `.env.local` for local overrides.

Required environment variables:

```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
VITE_TURNSTILE_SITE_KEY=
```

---

## ICP Deployment

This site is deployed as an **ICP asset canister** using the [DFX CLI](https://internetcomputer.org/docs/current/developer-docs/setup/install/).

### Prerequisites

- `dfx` installed (`sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"`)
- An ICP identity with cycles in its wallet

### Deploy

```bash
# Deploy to ICP mainnet
dfx deploy --network ic

# Or build first, then deploy
npm run build -- --mode production
dfx deploy --network ic
```

The canister ID is stored in `canister_ids.json`:

```json
{
  "portfolio": {
    "ic": "trwm2-7aaaa-aaaal-qwm6q-cai"
  }
}
```

### Cycles Cost Reference

| Operation | Cost (approx.) |
|---|---|
| Canister creation | ~0.5 TC (500B cycles) |
| Wasm install (first deploy) | ~0.05–0.1 TC |
| Subsequent deploys | ~0.01–0.05 TC |
| Storage (per GB/year) | ~1 TC |

> 1 TC = 1 trillion cycles ≈ 1.33 USD at time of writing.

---

## Custom Domain Setup

The site is registered under two custom domains via the ICP HTTP gateway custom domain service:

- `aungmyatkyaw.cv`
- `www.aungmyatkyaw.cv`

### DNS Records (Cloudflare)

For each domain (replace `DOMAIN` with `aungmyatkyaw.cv` or `www.aungmyatkyaw.cv`):

| Type | Name | Value |
|---|---|---|
| CNAME | `DOMAIN` | `DOMAIN.icp1.io` |
| TXT | `_canister-id.DOMAIN` | `trwm2-7aaaa-aaaal-qwm6q-cai` |
| CNAME | `_acme-challenge.DOMAIN` | `_acme-challenge.DOMAIN.icp2.io` |

> **Important:** Disable Cloudflare's Universal SSL / proxy (set DNS records to DNS-only, not proxied) for the `_acme-challenge` and canister ID records. The ICP gateway handles SSL certificate issuance automatically via ACME.

### ic-domains File

The file `public/.well-known/ic-domains` lists the registered domains:

```
aungmyatkyaw.cv
www.aungmyatkyaw.cv
```

This file must be accessible at `/.well-known/ic-domains` on the deployed canister. The `.ic-assets.json5` config ensures the `.well-known` directory is included in the deployment (DFX ignores hidden directories by default).

### Registering / Checking Domain Status

```bash
# Validate DNS config before registering
curl -sL -X GET https://icp0.io/custom-domains/v1/aungmyatkyaw.cv/validate | jq
curl -sL -X GET https://icp0.io/custom-domains/v1/www.aungmyatkyaw.cv/validate | jq

# Register domains with ICP HTTP gateway
curl -sL -X POST https://icp0.io/custom-domains/v1/aungmyatkyaw.cv | jq
curl -sL -X POST https://icp0.io/custom-domains/v1/www.aungmyatkyaw.cv | jq

# Check registration status (registering → registered)
curl -sL -X GET https://icp0.io/custom-domains/v1/aungmyatkyaw.cv | jq
curl -sL -X GET https://icp0.io/custom-domains/v1/www.aungmyatkyaw.cv | jq
```

---

## Asset Security Policy

Asset headers are configured in `public/.ic-assets.json5`.

Key settings:

- `.well-known` directory is explicitly included (`"ignore": false`) with `Access-Control-Allow-Origin: *`
- Static assets use `Cache-Control: public, max-age=31536000, immutable`
- `index.html` uses `Cache-Control: no-cache` and a strict Content Security Policy (CSP)

The CSP explicitly allows:

| Directive | Allowed Origins |
|---|---|
| `script-src` | `'self'`, `'unsafe-inline'`, `'unsafe-eval'`, `https://challenges.cloudflare.com` |
| `frame-src` | `https://challenges.cloudflare.com` |
| `connect-src` | `'self'`, `https://api.emailjs.com`, `https://icp-api.io` |
| `style-src` | `'self'`, `'unsafe-inline'` |
| `img-src` | `'self'`, `data:` |
| `font-src` | `'self'`, `data:` |

This allows Cloudflare Turnstile and EmailJS to function while maintaining a hardened security posture on ICP.
