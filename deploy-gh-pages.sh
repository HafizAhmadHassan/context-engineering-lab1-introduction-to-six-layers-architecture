#!/bin/bash
# Deploy the Next.js static export (web/out) to the gh-pages branch.
# GitHub Pages for this repo is configured to serve from the gh-pages branch.
set -euo pipefail

cd "$(dirname "$0")"

REPO_URL="https://github.com/HafizAhmadHassan/context-engineering-lab1-introduction-to-six-layers-architecture.git"

# Use GITHUB_TOKEN if set, otherwise git will use cached/remote credentials
GIT_URL="$REPO_URL"
if [[ -n "${GITHUB_TOKEN:-}" ]]; then
  GIT_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/HafizAhmadHassan/context-engineering-lab1-introduction-to-six-layers-architecture.git"
fi

echo "Building Next.js static export..."
cd web
npm run build
cd ..

COMMIT_SHA=$(git rev-parse --short HEAD)
COMMIT_MSG=$(git log -1 --pretty=%B | head -1)

OUT_DIR="$(pwd)/web/out"
echo ""
echo "Output: $OUT_DIR"
echo "Deploying ${COMMIT_SHA}: ${COMMIT_MSG}"

cd "$OUT_DIR"
touch .nojekyll

if [ ! -d .git ]; then
  git init -b gh-pages -q
fi
git remote remove origin 2>/dev/null || true
git remote add origin "$GIT_URL"
git config user.name "Hafiz Ahmad Hassan"
git config user.email "ahmadhassan061@gmail.com"
git add -A
git commit -q -m "Deploy ${COMMIT_SHA}: ${COMMIT_MSG}" || echo "no changes to deploy"
git push -f origin gh-pages

echo ""
echo "Deployed to https://hafizahmadhassan.github.io/context-engineering-lab1-introduction-to-six-layers-architecture/"
