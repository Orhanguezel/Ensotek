#!/usr/bin/env bash
set -euo pipefail
site=${1:?site required}
case "$site" in ensotek_de) origin=https://ensotek.de;; kuhlturm) origin=https://kuhlturm.com;; ensotek_com_tr) origin=https://www.ensotek.com.tr;; kompozit) origin=https://www.karbonkompozit.com.tr;; *) exit 2;; esac
repo_root=$(cd "$(dirname "$0")/.." && pwd)
cd "$repo_root/$site/frontend"
# Shell values override both .env.local and .env.production during Next compilation.
export NEXT_PUBLIC_SITE_URL="$origin"
export NEXT_PUBLIC_API_URL="$origin/api"
# Optional SSH tunnel avoids public proxy rate limits during static generation.
# NEXT_PUBLIC_API_URL always remains the real production origin.
export INTERNAL_API_URL="${CHECKLIST_INTERNAL_API_URL:-$origin/api}"
export API_INTERNAL_URL="$INTERNAL_API_URL"
if [[ "$site" == "ensotek_de" ]]; then
  python3 "$repo_root/scripts/build-de-icon-css.py"
fi
bun run build
python3 - "$origin" <<'PY'
from pathlib import Path
import sys,xml.etree.ElementTree as ET,json
origin=sys.argv[1]
p=Path('.next/server/app/sitemap.xml.body')
assert p.exists(),'Expected generated sitemap artifact'
r=ET.fromstring(p.read_text());urls=[x.text for x in r.findall('.//{*}loc')]
assert len(urls)>50,'Incomplete sitemap artifact'
assert all(u.startswith(origin+'/') for u in urls),'Foreign/localhost sitemap URL'
assert all(x.attrib.get('href','').startswith(origin+'/') for x in r.findall('.//{*}link')),'Foreign hreflang host'
for p in Path('.next/static').rglob('*.js'):
 s=p.read_text(errors='replace')
 assert not any(v in s for v in ['http://127.0.0.1:8086/api','http://localhost:3000','http://127.0.0.1:8089/api']),f'Local API/origin leaked into client bundle {p}'
print(json.dumps({'productionOrigin':origin,'sitemapUrls':len(urls),'clientBundleLocalEndpoints':False}))
PY
