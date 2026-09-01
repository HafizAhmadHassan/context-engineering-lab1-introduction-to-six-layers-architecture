# Context Engineering Lab
*Created: 2026-08-31 · Updated for GitHub Pages (Next.js)*

An interactive web app for learning **Context Engineering** by experimenting with the six context layers and observing how they affect LLM response quality. This project is a **static site** built with Next.js and deployed to **GitHub Pages** — no backend server is required.

## Live Site

<https://hafizahmadhassan.github.io/context-engineering-lab1-introduction-to-six-layers-architecture/>

## Features

- **Six Context Layers** — System Prompt, User Input, Conversation History, RAG Knowledge, Recent Conversation, State & Memory
- **Quick-Start Presets** — Customer Support, Code Review, Medical Triage, and Creative Writing presets that auto-fill all six layers with realistic data
- **Prompt Builder** — Concatenates enabled layers into a single prompt with live token/word/char counts
- **LLM Provider Selector** — OpenAI, Gemini, Anthropic, and Groq with model lists
- **Automatic Quality Evaluation** — Lite evaluation across 8 criteria (Persona Adherence, Policy Accuracy, Empathy Tone, Context Awareness, Actionability, Personalisation, No Hallucination, Completeness)
- **Visual Analytics** — Radar chart, bar chart, circular gauge, token usage chart, quality trend chart
- **Experiment History** — Save, favourite, and delete experiments (stored locally in the browser)
- **User Settings** — Default provider, favourite model, theme toggle, auto-save preferences
- **Quiz** — Interactive quiz covering context engineering and prompt engineering concepts
- **Dark/Light Mode** — Professional dark dashboard inspired by OpenAI Playground, LangSmith, and Anthropic Console

> **Demo mode:** Because GitHub Pages only serves static files, LLM generation and evaluation are simulated locally in the browser. Experiments, settings, and login are stored per-browser (`localStorage`). Use any credentials to sign in.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) with static export (`output: 'export'`) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Charts | Recharts |
| Icons | lucide-react |
| Deployment | GitHub Pages (static, via `gh-pages` branch) |

## Project Structure

```
ContextEngineeringLab/
├── web/                          # Next.js static app (deployed)
│   ├── public/
│   │   └── .nojekyll            # Tells GitHub Pages to keep _next/ assets
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── (auth)/login/    # /login
│   │   │   ├── (auth)/register/ # /register
│   │   │   ├── (dashboard)/     # protected routes
│   │   │   │   ├── dashboard/   # /dashboard
│   │   │   │   ├── history/     # /history
│   │   │   │   ├── settings/    # /settings
│   │   │   │   └── quiz/        # /quiz
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── page.tsx         # Redirects to /login or /dashboard
│   │   │   └── not-found.tsx    # 404 page
│   │   ├── charts/              # Recharts components
│   │   ├── components/          # UI components
│   │   ├── context/             # React context (auth)
│   │   ├── layouts/             # Layout wrappers
│   │   ├── services/            # Mock / local services (localStorage)
│   │   ├── store/               # Zustand state
│   │   ├── types/               # TypeScript types
│   │   └── utils/               # Utilities & presets
│   ├── next.config.mjs          # Static export + basePath config
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── .github/
│   └── workflows/deploy.yml     # Optional CI/CD (GitHub Actions) deploy
├── deploy-gh-pages.sh           # Manual deploy script (gh-pages branch)
└── README.md
```

> **Note:** The previous `client/` (Vite React) and `server/` (Express + MongoDB) folders were replaced by this single `web/` static app and are no longer part of the project. They are git-ignored and not deployed.

## Local Development

```bash
cd web
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build & Preview (static export)

```bash
cd web
npm run build
# Static site is emitted to web/out/
```

To preview the output exactly as GitHub Pages serves it:

```bash
cd web/out
python3 -m http.server 8080
# open http://localhost:8080
```

## Routes

| Path        | Description                              |
|-------------|------------------------------------------|
| `/`         | Redirects to `/login` or `/dashboard`    |
| `/login`    | Sign in (any credentials, demo mode)     |
| `/register` | Create account (demo mode)               |
| `/dashboard`| Context-layers lab with generation       |
| `/history`  | Saved experiments (stored in browser)    |
| `/settings` | Preferences (stored in browser)          |
| `/quiz`     | Quiz on context engineering concepts     |

## Deployment

The site is deployed to GitHub Pages. Two options are provided:

### Option A — Manual deploy (currently used, since Actions is disabled)

GitHub Pages for this repository is configured to serve from the **`gh-pages`** branch. To deploy:

```bash
GITHUB_TOKEN=<your-token> ./deploy-gh-pages.sh
```

This builds `web/out/` and force-pushes it to the `gh-pages` branch.

### Option B — GitHub Actions (auto-deploy)

A workflow at `.github/workflows/deploy.yml` builds and deploys to Pages on every push to `main`. This requires **GitHub Actions** to be enabled for your account (Settings → Actions → Enable); it is currently disabled for this account.

### Configuration notes

- `basePath` / `assetPrefix` in `web/next.config.mjs` are set to the repository name so assets and routes resolve correctly under the GitHub Pages sub-path.
- The `.nojekyll` file (from `web/public/`) tells GitHub Pages not to ignore the `_next/` build folder.
- To switch to a user/org page or custom domain, update `basePath`/`assetPrefix` in `next.config.mjs`.

## Context Layers

The application demonstrates six context layers that influence LLM responses:

1. **System Prompt** — Foundation instructions defining AI behaviour, persona, and constraints
2. **User Input** — The primary user query or instruction
3. **Conversation History** — Prior exchanges providing conversation continuity
4. **Retrieved Knowledge (RAG)** — Relevant documents from external knowledge sources
5. **Recent Conversation** — Latest exchanges for immediate context
6. **State & Memory** — User profile, preferences, session memory, runtime state

## Evaluation Criteria

Each generation is automatically evaluated across eight quality dimensions:

| Criterion | Description |
|-----------|-------------|
| Persona Adherence | How well the response maintains the assigned persona |
| Policy Accuracy | Factual and policy compliance |
| Empathy Tone | Appropriateness of emotional tone |
| Context Awareness | How well the response uses provided context |
| Actionability | How actionable the advice or information is |
| Personalisation | How tailored the response is to the user |
| No Hallucination | Avoidance of making up information |
| Completeness | Thoroughness of the response |

## Extending

### Adding a Provider

Add your provider and models to the `PROVIDERS` array in `web/src/components/Sidebar.tsx`, and extend the mock generation in `web/src/services/generation.service.ts`.

### Adding a Context Layer

Add the layer definition to `DEFAULT_LAYERS` in `web/src/utils/format.ts`, and add a preset under `USE_CASE_PRESETS` in the same file.

## License

MIT
