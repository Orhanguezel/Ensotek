#!/usr/bin/env bash
set -euo pipefail
app_dir=/var/www/Ensotek/ensotek_com_tr/frontend
stamp=$(date -u +%Y%m%dT%H%M%SZ)
candidate="$app_dir/.next.checklist-$stamp"
backup="$app_dir/.next.before-checklist-$stamp"
mkdir -p "$candidate"
tar --no-same-owner -xzf /tmp/ensotek-tr-checklist-release.tgz -C "$candidate"
test -f "$candidate/BUILD_ID"
# Keep old immutable chunks available to browsers holding the previous HTML.
rsync -a --ignore-existing "$app_dir/.next/static/" "$candidate/static/"
mv "$app_dir/.next" "$backup"
mv "$candidate" "$app_dir/.next"
rollback() {
  mv "$app_dir/.next" "$candidate.failed"
  mv "$backup" "$app_dir/.next"
  pm2 restart ensotek-com-tr-frontend >/dev/null
  exit 1
}
if ! pm2 restart ensotek-com-tr-frontend >/dev/null; then rollback; fi
ok=false
for attempt in 1 2 3 4 5; do
  if curl -fsS --max-time 30 http://127.0.0.1:3021/tr -o /dev/null; then ok=true; break; fi
  sleep 1
done
if test "$ok" != true; then rollback; fi
printf 'DEPLOYED ensotek_com_tr backup=%s\n' "$backup"
