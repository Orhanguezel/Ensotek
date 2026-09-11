#!/usr/bin/env bash
set -euo pipefail
root=/var/www/ekosistem-sosyal-medya
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup="/var/backups/tanitio-gsc-reliability-$stamp"
python3 - "$root" <<'PY'
import json,hashlib,sys
from pathlib import Path
r=Path(sys.argv[1]);expected=json.loads(Path('/tmp/tanitio-gsc-reliability-guard.json').read_text())
for n,h in expected.items():
 p=r/'dashboard'/n
 assert p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==h,'Concurrent source change: '+n
assert hashlib.sha256((r/'backend/dist/modules/marketing/gsc.js').read_bytes()).hexdigest()=='1afd5134e6820d7d005df21c981f845b5ade289a6c1ad27d7a605eb1b1335d17','Runtime concurrent change'
assert hashlib.sha256((r/'backend/src/modules/marketing/gsc.ts').read_bytes()).hexdigest()=='d4093b7ff8b26c7f2f90148ae7123ef44fd8fa9ca2f8f4a54b9cf72d292e112f','Backend concurrent change'
PY
mkdir -p "$backup" "$root/dashboard/.next.gsc-$stamp"
cp -p "$root/backend/src/modules/marketing/gsc.ts" "$backup/gsc.ts"
cp -p "$root/backend/dist/modules/marketing/gsc.js" "$backup/gsc.js"
cp -p "$root/dashboard/src/components/marketing/GscAnalysis.tsx" "$backup/GscAnalysis.tsx"
cp -p "$root/dashboard/src/components/marketing/metric-glossary.ts" "$backup/metric-glossary.ts"
tar -xzf /tmp/tanitio-gsc-reliability-dashboard.tgz -C "$root/dashboard/.next.gsc-$stamp"
rsync -a --ignore-existing "$root/dashboard/.next/static/" "$root/dashboard/.next.gsc-$stamp/static/"
cp /tmp/tanitio-gsc-reliability-gsc.ts "$root/backend/src/modules/marketing/gsc.ts"
cp /tmp/tanitio-gsc-runtime.js "$root/backend/dist/modules/marketing/gsc.js"
cp /tmp/tanitio-gsc-reliability-GscAnalysis.tsx "$root/dashboard/src/components/marketing/GscAnalysis.tsx"
cp /tmp/tanitio-gsc-reliability-metric-glossary.ts "$root/dashboard/src/components/marketing/metric-glossary.ts"
mv "$root/dashboard/.next" "$backup/next"
mv "$root/dashboard/.next.gsc-$stamp" "$root/dashboard/.next"
rollback() {
 cp -p "$backup/gsc.ts" "$root/backend/src/modules/marketing/gsc.ts"
 cp -p "$backup/gsc.js" "$root/backend/dist/modules/marketing/gsc.js"
 cp -p "$backup/GscAnalysis.tsx" "$root/dashboard/src/components/marketing/GscAnalysis.tsx"
 cp -p "$backup/metric-glossary.ts" "$root/dashboard/src/components/marketing/metric-glossary.ts"
 mv "$root/dashboard/.next" "$root/dashboard/.next.failed-gsc-$stamp"
 mv "$backup/next" "$root/dashboard/.next"
 pm2 restart ekosistem-sosyal-backend ekosistem-sosyal-dashboard >/dev/null
 exit 1
}
if ! pm2 restart ekosistem-sosyal-backend ekosistem-sosyal-dashboard >/dev/null; then rollback; fi
ok=false
for ((attempt=1; attempt<=30; attempt++)); do
 if curl -fsS --max-time 20 https://panel.tanitio.com/login -o /dev/null && curl -fsS --max-time 10 http://127.0.0.1:8089/api/v1/health -o /dev/null; then ok=true;break;fi
 sleep 2
done
if test "$ok" != true; then rollback; fi
printf 'DEPLOYED GSC reliability; backup=%s\n' "$backup"
