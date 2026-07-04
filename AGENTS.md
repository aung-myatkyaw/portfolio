# AGENTS.md

## Cursor Cloud specific instructions

This repo is a personal portfolio website: a **React + Vite** frontend with an **optional Rust ICP (Internet Computer) backend canister** that powers the "Ask About Me" AI agent. For local development the frontend is the primary product and runs fully standalone.

### Services

| Service | How to run | Notes |
|---|---|---|
| Frontend (React + Vite) | `npm run dev` | Serves at `http://localhost:5173/`. This is the main dev target. |
| Backend (Rust ICP canister) | See README "Full stack" section | Optional. Requires the `icp` CLI (not installed) + `wasm32-unknown-unknown` Rust target + a local ICP network (`icp network start -d`). Not needed to develop/preview the site. |

### Running / testing (standard commands live in `package.json`)

- Install deps: `npm install` (run by the startup update script).
- Dev server: `npm run dev` (port 5173).
- Lint: `npm run lint` — passes with one pre-existing `react-refresh/only-export-components` warning in `src/context/AskMeContext.jsx` (0 errors). This warning is expected; do not treat it as a regression.
- Build: `npm run build` (Vite build to `dist/`, includes gzip + brotli compression).
- Preview built output: `npm run preview`.

### Non-obvious caveats

- **The AI "Ask About Me" agent will not work locally** without the Rust backend canister deployed on a local ICP network. On the Contact page it shows "agent unavailable — backend canister not configured". This is expected in the frontend-only dev setup; the rest of the site works normally.
- The frontend auto-detects local vs. mainnet at runtime via `window.location.hostname` (see `src/lib/askMeActor.js`), so no build-time canister ID is required just to run the site.
- Environment variables (EmailJS, Cloudflare Turnstile, backend canister ID) are optional for local dev — the contact form UI renders and accepts input without them, but actually sending email / passing captcha requires the real values. Copy `.env.example` to `.env.local` if you need them.
- The `icp` CLI is **not** installed in the environment and full-stack ICP deployment is out of scope for local frontend development.
