#!/usr/bin/env python3
import json,pathlib,subprocess,os,datetime
body=json.loads(pathlib.Path('/tmp/ensotek-quality-2026-09-10.json').read_text())
b=pathlib.Path('/var/backups/ensotek-quality-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'));b.mkdir(mode=0o700)
def sql(q):
 r=subprocess.run(['mysql','-NBr'],input=q,text=True,capture_output=True)
 if r.returncode:raise RuntimeError('\n'.join(x for x in r.stderr.splitlines() if x.startswith('ERROR')))
 return r.stdout
def lit(x):return 'CONVERT(0x'+x.encode().hex()+' USING utf8mb4) COLLATE utf8mb4_unicode_ci'
results=[]
for db in ['ensotek','kuhlturm_live']:
 parent="id='11111111-2222-3333-4444-555555555574'";child="page_id='11111111-2222-3333-4444-555555555574'"
 before=sql('SELECT JSON_OBJECT(\'id\',id,\'locale\',locale,\'content\',content,\'summary\',summary,\'meta_description\',meta_description) FROM '+db+'.custom_pages_i18n WHERE '+child)
 f=b/(db+'-content.jsonl');f.write_text(before);os.chmod(f,0o600)
 f=b/(db+'-gallery.jsonl');f.write_text(sql("SELECT JSON_OBJECT('id',id,'images',images) FROM "+db+'.custom_pages WHERE '+parent));os.chmod(f,0o600)
 statements=[]
 for lang,html in body.items():
  desc={'de':'Ensotek Qualitätsdokumente: ISO 9001, ISO 10002 und modellbezogene CE-Erklärung mit dokumentierten Daten und Geltungsbereichen.','en':'Ensotek quality documents: ISO 9001, ISO 10002 and model-specific CE declaration, with documented dates and scope.','tr':'Ensotek kalite belgeleri: ISO 9001, ISO 10002 ve modele özel CE beyanı; belgelerdeki tarihler ve kapsam bilgileri.'}[lang]
  statements.append('UPDATE '+db+'.custom_pages_i18n SET content='+lit(json.dumps({'html':html},ensure_ascii=False))+',summary='+lit(desc)+',meta_description='+lit(desc)+' WHERE '+child+' AND locale='+lit(lang)+';')
 gallery=json.dumps(['/uploads/certificates/2026-09-10/'+n+'.jpg' for n in ['iso9001','iso10002','ce']])
 statements.append('UPDATE '+db+'.custom_pages SET images='+lit(gallery)+' WHERE '+parent+';')
 sql('START TRANSACTION;\n'+'\n'.join(statements)+'\nCOMMIT;')
 results.append({'database':db,'nonEmptyLocales':int(sql('SELECT COUNT(*) FROM '+db+'.custom_pages_i18n WHERE '+child+' AND LENGTH(content)>1000').strip()),'currentDocumentImages':3})
print(json.dumps({'backup':str(b),'results':results}))
