# Context Engineering Lab — GitHub Pages (Next.js)

This is a static-rendered version of the Context Engineering Lab, built with **Next.js static export** so it can be hosted on **GitHub Pages** with no backend required.

## Why this version

The original app (`client/` + `server/`) is a Vite React SPA backed by an Express/Mongo API. GitHub Pages only serves static files, so this version:

- Replaces the backend calls with **local, browser-stored mock data** (`localStorage`).
- Simulates LLM generation and quality evaluation entirely in the browser (demo mode).
- Keeps auth/experiments/settings client-side and persistent per-browser.

## Tech stack

- **Next.js 14** (App Router) with `output: 'export'`
- **Tailwind CSS** (same design system as the original)
- **Recharts** for charts (SSR-friendly replacement for Plotly)
- **Zustand** for state
- **GitHub Actions** for automatic deployment to GitHub Pages

## Routes

| Path                  | Description                              |
| --------------------- | ---------------------------------------- |
| `/login`              | Sign in (any credentials, demo mode)     |
| `/register`           | Create account (demo mode)               |
| `/dashboard`          | Context-layers lab with generation       |
| `/history`            | Saved experiments (stored in browser)    |
| `/settings`           | Preferences (stored in browser)          |
| `/quiz`               | Quiz on context engineering concepts     |

## Local development

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000.

## Build & preview the static output

```bash
cd web
npm run build
# The static site is emitted to web/out
```

To preview the output exactly as GitHub Pages will serve it (under the repo base path):

```bash
python3 -m http.server 8080 -d out
# then open http://localhost:8080 (serve out under the basePath dir for full fidelity)
```

## Deploying to GitHub Pages

A GitHub Actions workflow is included at `.github/workflows/deploy.yml`. On every push to `main`, it:

1. Installs dependencies
2. Builds the static export
3. Uploads `web/out` as a Pages artifact
4. Deploys to GitHub Pages

### One-time setup (required)

1. **Enable GitHub Pages**: In your repo go to
   **Settings → Pages → Build and deployment**, set *Source* to
   **"GitHub Actions"** (not "Deploy from a branch").

2. Push the new `web/` and `.github/workflows/` to `main`. The workflow will run automatically.

3. The site is then available at:
   `https://HafizAhmadHassan.github.io/context-engineering-lab1-introduction-to-six-layers-architecture/`

## Configuration notes

- `basePath` / `assetPrefix` in `next.config.mjs` are set to the repo name so assets and routes resolve correctly under the GitHub Pages sub-path.
- The `.nojekyll` file (from `web/public/`) tells GitHub Pages to keep the `_next/` build folder.
- To switch to a user/org page or custom domain, update `basePath`/`assetPrefix` to `/` (or the domain path) accordingly.
