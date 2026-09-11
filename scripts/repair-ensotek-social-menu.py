#!/usr/bin/env python3
import subprocess,pathlib,datetime,os,json
b=pathlib.Path('/var/backups/ensotek-social-menu-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'));b.mkdir(mode=0o700)
def sql(q):return subprocess.run(['mysql','-NBr'],input=q,text=True,capture_output=True,check=True).stdout
mapping={'https://www.youtube.com/@ensotek':'https://www.youtube.com/channel/UCX22ErWzyT4wDqDRGN9zYmg','https://youtube.com/@ensotek':'https://www.youtube.com/channel/UCX22ErWzyT4wDqDRGN9zYmg','https://www.instagram.com/ensotek':'https://www.instagram.com/ensotek_tr/','https://instagram.com/ensotek':'https://www.instagram.com/ensotek_tr/','https://www.instagram.com/ensotek/':'https://www.instagram.com/ensotek_tr/','https://www.facebook.com/ensotek':'https://www.facebook.com/Ensotek/','https://facebook.com/ensotek':'https://www.facebook.com/Ensotek/','https://x.com/ensotek':'https://twitter.com/Ensotek_Cooling'}
results=[]
for db in ['ensotek','ensotek_com_tr_db','kuhlturm_live']:
 rows=sql("SELECT JSON_OBJECT('id',i.id,'url',i.url,'parent',m.id,'active',m.is_active) FROM "+db+'.menu_items_i18n i JOIN '+db+".menu_items m ON m.id=i.menu_item_id WHERE m.location='footer' AND i.url LIKE 'https://%'")
 f=b/(db+'.jsonl');f.write_text(rows);os.chmod(f,0o600);changed=0
 for r in map(json.loads,rows.splitlines()):
  if r['url'] in mapping:sql('UPDATE '+db+".menu_items_i18n SET url='"+mapping[r['url']]+"' WHERE id='"+r['id']+"'");changed+=1
  elif 'linkedin.com/company/ensotek' in r['url'] or 'tiktok.com/@ensotek' in r['url']:sql('UPDATE '+db+".menu_items SET is_active=0 WHERE id='"+r['parent']+"'");changed+=1
 results.append({'database':db,'changes':changed})
print(json.dumps({'backup':str(b),'results':results}))
