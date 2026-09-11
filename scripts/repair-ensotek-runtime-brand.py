#!/usr/bin/env python3
"""Run on vps-Ensotek. Changes only the non-secret SITE_NAME setting; keeps private backup."""
from pathlib import Path
import datetime,json,os
root=Path('/var/www/Ensotek')
backup=Path('/var/backups')/('ensotek-runtime-brand-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'))
backup.mkdir(mode=0o700)
for site,name in {'ensotek_de':'Ensotek','ensotek_com_tr':'Ensotek','kuhlturm':'Kühlturm — Ensotek','kompozit':'MOE Kompozit'}.items():
 p=root/site/'backend/.env';old=p.read_text();dest=backup/(site+'.env');dest.write_text(old);dest.chmod(0o600)
 lines=[l for l in old.splitlines() if not l.startswith('SITE_NAME=')];lines.append('SITE_NAME='+json.dumps(name,ensure_ascii=False))
 p.write_text('\n'.join(lines)+'\n');print(json.dumps({'site':site,'siteName':name,'backup':str(dest)},ensure_ascii=False))
