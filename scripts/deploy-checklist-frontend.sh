#!/usr/bin/env bash
# Run on vps-Ensotek after copying the validated standalone archive to /tmp.
set -euo pipefail
site=${1:?site required}
case "$site" in kompozit) port=3020; service=kompozit-frontend;; kuhlturm) port=3025; service=kuhlturm-frontend;; ensotek_de) port=3011; service=ensotek-frontend;; *) exit 2;; esac
app_dir="/var/www/Ensotek/$site/frontend"
stamp=$(date -u +%Y%m%dT%H%M%SZ)
candidate="$app_dir/.next/standalone.checklist-$stamp"
backup="$app_dir/.next/standalone.before-checklist-$stamp"
archive="/tmp/ensotek-$site-checklist-release.tgz"
mkdir -p "$candidate"
tar --no-same-owner -xzf "$archive" -C "$candidate"
test -f "$candidate/$site/frontend/server.js"
# Refuse a wrongly compiled origin before swapping a working deployment.
python3 - "$site" "$candidate" <<'PYGUARD'
import pathlib,sys,xml.etree.ElementTree as ET
site,root=sys.argv[1:]
origin={'ensotek_de':'https://ensotek.de','kuhlturm':'https://kuhlturm.com','kompozit':'https://www.karbonkompozit.com.tr'}[site]
p=pathlib.Path(root)/site/'frontend/.next/server/app/sitemap.xml.body'
if p.exists():
 urls=[e.text for e in ET.fromstring(p.read_text()).findall('.//{*}loc')]
 assert urls and all(u.startswith(origin+'/') for u in urls),'Sitemap production origin gate failed'
PYGUARD
# Keep production runtime configuration on the server; never transfer local .env files.
if test -f "$app_dir/.next/standalone/$site/frontend/.env.production"; then
  cp -p "$app_dir/.next/standalone/$site/frontend/.env.production" "$candidate/$site/frontend/.env.production"
fi
# Preserve only the optimizer's content-addressed image cache, never old page/data caches.
image_cache="$app_dir/.next/standalone/$site/frontend/.next/cache/images"
if test -d "$image_cache"; then
  mkdir -p "$candidate/$site/frontend/.next/cache/images"
  rsync -a "$image_cache/" "$candidate/$site/frontend/.next/cache/images/"
fi
# nginx serves these by immutable hash. Retain old chunks for open pages and rollback.
rsync -a "$candidate/$site/frontend/.next/static/" "$app_dir/.next/static/"
mv "$app_dir/.next/standalone" "$backup"
mv "$candidate" "$app_dir/.next/standalone"
rollback() {
  mv "$app_dir/.next/standalone" "$candidate.failed"
  mv "$backup" "$app_dir/.next/standalone"
  pm2 restart "$service" >/dev/null
  echo "ROLLBACK $site" >&2
  exit 1
}
if ! pm2 restart "$service" >/dev/null; then rollback; fi
ok=false
for attempt in 1 2 3 4 5; do
  if curl -fsS --max-time 30 "http://127.0.0.1:$port/en" -o /dev/null; then ok=true; break; fi
  sleep 1
done
if test "$ok" != true; then rollback; fi
printf 'DEPLOYED %s backup=%s\n' "$site" "$backup"
