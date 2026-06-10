#!/usr/bin/env bash
set -euo pipefail

echo "== Hồn Thơ App VPS deploy =="

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Đã tạo .env. Hãy sửa .env trước khi chạy lại."
  exit 1
fi

docker compose up -d --build
docker compose ps
