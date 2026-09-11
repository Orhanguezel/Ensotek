#!/usr/bin/env bash
set -euo pipefail
root=/var/www/ekosistem-sosyal-medya/dashboard
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup="/var/backups/tanitio-domain-dashboard-$stamp"
stage="$root/.next.domain-$stamp"
python3 - "$root" <<'PY'
import json,hashlib,sys
from pathlib import Path
r=Path(sys.argv[1]); expected=json.loads(Path('/tmp/tanitio-domain-dashboard-guard.json').read_text())
for name,digest in expected.items():
 if not (r/name).is_file() or hashlib.sha256((r/name).read_bytes()).hexdigest()!=digest:raise SystemExit('Concurrent source change: '+name)
PY
mkdir -p "$backup" "$stage"
files=(src/app/rakip-kesfi/page.tsx src/lib/api.ts)
for file in "${files[@]}"; do mkdir -p "$backup/$(dirname "$file")"; cp -p "$root/$file" "$backup/$file"; done
tar -xzf /tmp/tanitio-domain-dashboard.tgz -C "$stage"
rsync -a --ignore-existing "$root/.next/static/" "$stage/static/"
tar -xzf /tmp/tanitio-domain-dashboard-sources.tgz -C "$root"
mv "$root/.next" "$backup/next"
mv "$stage" "$root/.next"
rollback() {
 for file in "${files[@]}"; do cp -p "$backup/$file" "$root/$file"; done
 mv "$root/.next" "$root/.next.domain-failed-$stamp"
 mv "$backup/next" "$root/.next"
 pm2 restart ekosistem-sosyal-dashboard >/dev/null
 echo 'ROLLED BACK' >&2
 exit 1
}
if ! pm2 restart ekosistem-sosyal-dashboard >/dev/null; then rollback; fi
ok=false
for attempt in 1 2 3 4 5; do
 if curl -fsS --max-time 20 https://panel.tanitio.com/login -o /dev/null; then ok=true; break; fi
 sleep 1
done
if test "$ok" != true; then rollback; fi
printf 'DEPLOYED domain grouping dashboard; backup=%s\n' "$backup"
