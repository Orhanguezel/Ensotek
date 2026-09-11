#!/usr/bin/env python3
"""VPS-only: attach verified public PDFs; preserve existing unrelated settings."""
from pathlib import Path
import json,subprocess,datetime,urllib.request
backup=Path('/var/backups')/('ensotek-catalog-sources-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'));backup.mkdir(mode=0o700)
def sql(q):
 p=subprocess.run(['mysql','-NBr'],input=q,text=True,capture_output=True)
 if p.returncode:raise RuntimeError(p.stderr)
 return p.stdout
def lit(x):return 'CONVERT(0x'+x.encode().hex()+' USING utf8mb4) COLLATE utf8mb4_unicode_ci'
sites={'ensotek':('https://ensotek.de',['de','en','tr']),'ensotek_com_tr_db':('https://www.ensotek.com.tr',['tr','en']),'kuhlturm_live':('https://kuhlturm.com',['de','en']),'kompozit':('https://www.karbonkompozit.com.tr',['tr','en'])}
proof=[]
for db,(origin,locales) in sites.items():
 rows=[json.loads(x) for x in sql(f"SELECT JSON_OBJECT('id',id,'key',`key`,'locale',locale,'value',value) FROM {db}.site_settings WHERE `key` IN ('catalog_pdf','catalog_pdf_filename')").splitlines()]
 p=backup/(db+'.json');p.write_text(json.dumps(rows,ensure_ascii=False,indent=2));p.chmod(0o600)
 statements=[]
 for locale in locales:
  filename=f'moe-kompozit-portfolio-{locale}-20260910.pdf' if db=='kompozit' else 'ensotek-katalog.pdf'
  url=origin+'/uploads/catalog/'+filename
  with urllib.request.urlopen(urllib.request.Request(url,headers={'Range':'bytes=0-1023'}),timeout=15) as response:
   assert response.status in [200,206] and 'application/pdf' in response.headers.get('content-type','') and response.read(5)==b'%PDF-',url
  for key,value in [('catalog_pdf',url),('catalog_pdf_filename',filename)]:
   row=next((r for r in rows if r['key']==key and r['locale']==locale),None)
   statements.append(f'UPDATE {db}.site_settings SET value={lit(value)} WHERE id={lit(row["id"])};' if row else f'INSERT INTO {db}.site_settings(id,`key`,locale,value) VALUES(UUID(),{lit(key)},{lit(locale)},{lit(value)});')
  proof.append({'database':db,'locale':locale,'url':url,'pdfVerified':True})
 sql('START TRANSACTION;\n'+'\n'.join(statements)+'\nCOMMIT;')
print(json.dumps({'backup':str(backup),'sources':proof},ensure_ascii=False))
