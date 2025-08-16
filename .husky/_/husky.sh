#!/usr/bin/env sh
if [ -f ~/.huskyrc.sh ]; then
  . ~/.huskyrc.sh
fi

# 檢查是否在 git 倉庫中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ 錯誤: 此目錄不是 git 倉庫"
  exit 1
fi

# 檢查 husky 是否已安裝
if ! command -v husky > /dev/null 2>&1; then
  echo "⚠️  警告: husky 未安裝，請執行 'npm install -g husky'"
fi
