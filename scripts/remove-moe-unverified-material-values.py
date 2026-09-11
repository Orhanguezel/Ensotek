#!/usr/bin/env python3
import json,subprocess,pathlib
root=pathlib.Path('/var/www/Ensotek');backup=pathlib.Path('/var/backups/moe-materials-before-20260910.json')
def sql(q):return subprocess.run(['mysql','-NB'],input=q,text=True,capture_output=True,check=True).stdout
before=sql("SELECT JSON_OBJECT('id',id,'locale',locale,'value',value) FROM kompozit.site_settings WHERE `key`='kompozit__home.materials'")
if not backup.exists():backup.write_text(before);backup.chmod(0o600)
for locale in ['tr','en']:
 d=json.loads((root/f'kompozit/frontend/public/locales/{locale}.json').read_text())['home']['materials'];v={k:d[k] for k in ['sectionLabel','title','subtitle']};v['items']=[{'id':k,**d[k]} for k in ['carbon','frp']];encoded=json.dumps(v,ensure_ascii=False).encode().hex()
 sql("UPDATE kompozit.site_settings SET value=CONVERT(0x"+encoded+" USING utf8mb4),updated_at=UTC_TIMESTAMP(3) WHERE `key`='kompozit__home.materials' AND locale='"+locale+"'")
print(json.dumps({'updatedLocales':['tr','en'],'removed':'Ungraded generalized material strength/density/modulus claims','backup':str(backup)}))
