#!/usr/bin/env bash
set -euo pipefail
root=/var/www/ekosistem-sosyal-medya/dashboard
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup="/var/backups/tanitio-gsc-evidence-$stamp"
stage="$root/.next.gsc-$stamp"
python3 - "$root" <<'PY'
import json,hashlib,sys
from pathlib import Path
r=Path(sys.argv[1]); expected=json.loads(Path('/tmp/tanitio-gsc-source-guard.json').read_text())
for n,h in expected.items():
 if not (r/n).is_file() or hashlib.sha256((r/n).read_bytes()).hexdigest()!=h:raise SystemExit('Concurrent source change: '+n)
PY
mkdir -p "$backup" "$stage"
cp -p "$root/src/components/marketing/GscAnalysis.tsx" "$backup/GscAnalysis.tsx"
tar -xzf /tmp/tanitio-gsc-evidence-dashboard.tgz -C "$stage"
rsync -a --ignore-existing "$root/.next/static/" "$stage/static/"
cp /tmp/tanitio-gsc-evidence-GscAnalysis.tsx "$root/src/components/marketing/GscAnalysis.tsx"
mv "$root/.next" "$backup/next"
mv "$stage" "$root/.next"
rollback() {
 cp -p "$backup/GscAnalysis.tsx" "$root/src/components/marketing/GscAnalysis.tsx"
 mv "$root/.next" "$root/.next.gsc-failed-$stamp"
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
printf 'DEPLOYED GSC evidence UI; backup=%s\n' "$backup"
