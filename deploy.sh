#!/bin/bash
# deploy.sh - 一键部署dist到GitHub
# 用法: bash deploy.sh "提交说明"

cd "$(dirname "$0")"

MSG="${1:-Update: sync dist to GitHub}"

git add -A
git status

# 检查是否有变更
if git diff --cached --quiet; then
  echo "No changes to deploy."
  exit 0
fi

git commit -m "$MSG"
GIT_SSL_NO_VERIFY=true git push origin main

echo "Deployed successfully!"
