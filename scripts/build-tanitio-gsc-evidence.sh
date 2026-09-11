#!/usr/bin/env bash
set -euo pipefail
cd /tmp/tanitio-gtm-checklist-20260909/dashboard
NEXT_PUBLIC_API_URL=https://panel.tanitio.com/api/v1 \
NEXT_PUBLIC_SITE_URL=https://panel.tanitio.com \
NEXT_PUBLIC_APP_NAME=Tanitio \
NEXT_PUBLIC_BACKEND_URL=https://panel.tanitio.com \
NEXT_PUBLIC_DEFAULT_TENANT_KEY=vistaseeds \
NEXT_PUBLIC_META_BUSINESS_ID=1640774210802128 bun run build
python3 - <<'PY'
from pathlib import Path
chunks=[p.read_text() for p in Path('.next/static').rglob('*.js')]
assert any('https://panel.tanitio.com/api/v1' in c for c in chunks), 'Production API missing'
assert not any('"http://localhost:8089/api/v1"' in c for c in chunks), 'Local API in production bundle'
print('Production bundle API check passed')
PY
