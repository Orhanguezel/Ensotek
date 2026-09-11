#!/usr/bin/env bash
set -euo pipefail
root=/var/www/ekosistem-sosyal-medya
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup="/var/backups/tanitio-brand-policy-$stamp"
stage="/tmp/tanitio-brand-policy-$stamp"
python3 - "$root" <<'PY'
import hashlib,sys
from pathlib import Path
r=Path(sys.argv[1])
for name,expected in {'marketing/routes':'204c531adbbfd5564ef9c66dfd2ef0feb940caada382cdccec0486859bd812a0','competitor-discovery/discovery':'55a11e9e587d28f14d2d0301ec196b79e5c2ee2271ff53ea885a02cfd1938a25'}.items():
 if hashlib.sha256((r/'backend/src/modules'/f'{name}.ts').read_bytes()).hexdigest()!=expected:raise SystemExit('Concurrent edit: '+name)
PY
mkdir -p "$backup" "$stage"
tar -xzf /tmp/tanitio-brand-policy-release.tgz -C "$stage"
files=(backend/src/modules/marketing/brand-policy.ts backend/dist/modules/marketing/brand-policy.js backend/src/modules/marketing/routes.ts backend/dist/modules/marketing/routes.js backend/src/modules/competitor-discovery/discovery.ts backend/dist/modules/competitor-discovery/discovery.js)
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
