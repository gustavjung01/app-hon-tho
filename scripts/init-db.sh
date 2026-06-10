#!/usr/bin/env bash
set -euo pipefail

docker compose exec postgres psql -U "${POSTGRES_USER:-hontho}" -d "${POSTGRES_DB:-hontho_app}" -f /schema/schema.sql
