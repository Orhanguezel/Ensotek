#!/usr/bin/env bash
set -euo pipefail
root=/var/www/ekosistem-sosyal-medya
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup="/var/backups/tanitio-domain-policy-$stamp"
stage="/tmp/tanitio-domain-policy-$stamp"
python3 - "$root" <<'PY'
import hashlib,sys,json
from pathlib import Path
r=Path(sys.argv[1])
for name,expected in json.loads(Path('/tmp/tanitio-domain-backend-guard.json').read_text()).items():
 if hashlib.sha256((r/name).read_bytes()).hexdigest()!=expected:raise SystemExit('Concurrent edit: '+name)
if (r/'backend/src/modules/competitor-discovery/domain-policy.ts').exists():raise SystemExit('New policy file already exists')
PY
mkdir -p "$backup" "$stage"
tar -xzf /tmp/tanitio-domain-policy-release.tgz -C "$stage"
files=(backend/src/modules/competitor-discovery/domain-policy.ts backend/src/modules/competitor-discovery/discovery.ts backend/src/modules/competitor-discovery/routes.ts backend/dist/modules/competitor-discovery/domain-policy.js backend/dist/modules/competitor-discovery/discovery.js backend/dist/modules/competitor-discovery/routes.js)
for file in "${files[@]}"; do
 mkdir -p "$backup/$(dirname "$file")"
 if test -f "$root/$file"; then cp -p "$root/$file" "$backup/$file"; fi
 cp -p "$stage/$file" "$root/$file"
done
rollback() {
 for file in "${files[@]}"; do
  if test -f "$backup/$file"; then cp -p "$backup/$file" "$root/$file"; else rm -f "$root/$file"; fi
 done
 pm2 restart ekosistem-sosyal-backend >/dev/null
 exit 1
}
if ! pm2 restart ekosistem-sosyal-backend >/dev/null; then rollback; fi
ok=false
for attempt in 1 2 3 4 5; do
 if curl -fsS --max-time 20 http://127.0.0.1:8089/api/health -o /dev/null; then ok=true; break; fi
 sleep 1
done
if test "$ok" != true; then rollback; fi
printf 'DEPLOYED brand policy; backup=%s\n' "$backup"
