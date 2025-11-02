#!/usr/bin/env bash
# Usage: ./deploy.sh <remote> <app_dir> [branch]
# Beispiel: ./deploy.sh my-ec2 /var/www/myapp main
set -euo pipefail

REMOTE="${1:-my-ec2}"
APP_DIR="${2:-/var/www/myapp}"
BRANCH="${3:-main}"

REPO_URL="git@github.com:yourorg/yourrepo.git"  # ANPASSEN: dein Repo (SSH-URL)
SERVICE_NAME="myapp"                             # ANPASSEN: dein systemd Service-Name

echo "[1/5] Zielverzeichnis sicherstellen..."
ssh "$REMOTE" "sudo mkdir -p '$APP_DIR' && sudo chown -R \$USER '\$APP_DIR'"

if ssh "$REMOTE" "[ -d '$APP_DIR/.git' ]"; then
  echo "[2/5] Repo existiert – Update per git..."
  ssh "$REMOTE" "cd '$APP_DIR' && git fetch --all && git reset --hard origin/$BRANCH && git clean -fd"
else
  echo "[2/5] Frischer Clone..."
  ssh "$REMOTE" "rm -rf '$APP_DIR' && mkdir -p '$APP_DIR'"
  ssh "$REMOTE" "git clone --branch '$BRANCH' '$REPO_URL' '$APP_DIR'"
fi

echo "[3/5] Alte Artefakte entfernen..."
ssh "$REMOTE" "cd '$APP_DIR' && rm -rf node_modules dist build .venv .cache || true"

echo "[4/5] Dependencies installieren und ggf. Build..."
ssh "$REMOTE" "cd '$APP_DIR' && \
  if [ -f package.json ]; then \
    command -v pnpm >/dev/null 2>&1 && pnpm i || (command -v yarn >/dev/null 2>&1 && yarn || npm ci); \
    npm run build || true; \
  fi && \
  if [ -f requirements.txt ]; then \
    python3 -m venv .venv && . .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt; \
  fi"

echo "[5/5] Service neu starten (optional)..."
ssh "$REMOTE" "sudo systemctl daemon-reload || true; sudo systemctl restart '$SERVICE_NAME' || true; sudo systemctl status '$SERVICE_NAME' --no-pager || true"

echo "Deploy abgeschlossen."

