#!/usr/bin/env python3
import json,subprocess,pathlib,os
root=pathlib.Path('/var/www/Ensotek');backup=pathlib.Path('/var/backups/moe-stats-before-20260910.json')
def sql(q):return subprocess.run(['mysql','-NB'],input=q,text=True,capture_output=True,check=True).stdout
before=sql("SELECT JSON_OBJECT('id',id,'locale',locale,'value',value) FROM kompozit.site_settings WHERE `key`='kompozit__home.stats'")
if not backup.exists():backup.write_text(before);backup.chmod(0o600)
for locale in ['tr','en']:
 d=json.loads((root/f'kompozit/frontend/public/locales/{locale}.json').read_text())['home']['stats'];v={'items':[{'value':d[a+'Number'],'label':d[a+'Label']} for a in ['yoe','projects','standard','cert']]};encoded=json.dumps(v,ensure_ascii=False).encode().hex()
 sql("UPDATE kompozit.site_settings SET value=CONVERT(0x"+encoded+" USING utf8mb4),updated_at=UTC_TIMESTAMP(3) WHERE `key`='kompozit__home.stats' AND locale='"+locale+"'")
print(json.dumps({'updatedLocales':['tr','en'],'source':'neutral frontend labels; no unsupported count/certification claim','backup':str(backup)}))
