#!/usr/bin/env python3
"""VPS-only, public sourced values. Backup before changing; no secrets are read."""
import pathlib,json,subprocess,datetime,os
stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
b=pathlib.Path('/var/backups/ensotek-public-identity-'+stamp);b.mkdir(mode=0o700)
def sql(q):
 r=subprocess.run(['mysql','-NBr'],input=q,text=True,capture_output=True)
 if r.returncode:raise RuntimeError('\n'.join(x for x in r.stderr.splitlines() if x.startswith('ERROR')))
 return r.stdout
def lit(x):return "CONVERT(0x"+x.encode().hex()+" USING utf8mb4) COLLATE utf8mb4_unicode_ci"
social={'instagram':'https://www.instagram.com/ensotek_tr/','facebook':'https://www.facebook.com/Ensotek/','youtube':'https://www.youtube.com/channel/UCX22ErWzyT4wDqDRGN9zYmg','x':'https://twitter.com/Ensotek_Cooling','linkedin':'','tiktok':''}
name='ENSOTEK CTP Su Soğutma Kuleleri ve Teknolojileri Mühendislik Sanayi Ticaret Limited Şirketi'
changes=[]
for db in ['ensotek','ensotek_com_tr_db','kuhlturm_live']:
 q="SELECT JSON_OBJECT('id',id,'key',`key`,'locale',locale,'value',value) FROM "+db+".site_settings WHERE `key` IN ('contact_info','socials','footer_company_name','smtp_from_name','catalog_pdf_filename')"
 rows=[json.loads(x) for x in sql(q).splitlines()];f=b/(db+'.json');f.write_text(json.dumps(rows,ensure_ascii=False,indent=2));os.chmod(f,0o600)
 statements=[]
 for r in rows:
  val=None
  if r['key']=='contact_info':
   v=json.loads(r['value']);v['company_name']=name;v['email']='ensotek@ensotek.com.tr';v['email_2']='export@ensotek.com.tr'
   # Preserve the mobile-first TR site's layout, and correct the unverified second mobile.
   if db=='ensotek_com_tr_db':v.update(phone='+90 531 880 31 51',phone_2='+90 212 613 33 01',phone_is_whatsapp=True,phone_2_is_whatsapp=False)
   else:v.update(phone='+90 212 613 33 01',phone_2='+90 531 880 31 51',phone_is_whatsapp=False,phone_2_is_whatsapp=True)
   v['address']='Oruçreis Mah. Tekstilkent Sit. A17 Blok No:41 34235 Esenler / İstanbul, Türkiye'
   v['factory_address']='Saray Mah. Gimat Cad. No:6A 06980 Kahramankazan / Ankara, Türkiye'
   v['address_2']=v['factory_address'];v['city_2']='Ankara';v['country_2']='Türkiye';val=json.dumps(v,ensure_ascii=False)
  elif r['key']=='socials':val=json.dumps(social)
  elif db=='ensotek' and r['key'] in ['footer_company_name','smtp_from_name']:val='Ensotek'
  elif db=='ensotek' and r['key']=='catalog_pdf_filename':val='ensotek-katalog.pdf' if r['locale']!='en' else 'ensotek-catalog.pdf'
  if val is not None and val!=r['value']:
   statements.append('UPDATE '+db+'.site_settings SET value='+lit(val)+' WHERE id='+lit(r['id'])+';');changes.append({'database':db,'key':r['key'],'locale':r['locale']})
 for locale in ['de','en','tr']:
  if not any(r['key']=='socials' and r['locale']==locale for r in rows):statements.append('INSERT INTO '+db+".site_settings (id,`key`,locale,value) VALUES(UUID(),'socials',"+lit(locale)+','+lit(json.dumps(social))+');')
 sql('START TRANSACTION;\n'+'\n'.join(statements)+'\nCOMMIT;')
print(json.dumps({'backup':str(b),'changes':changes,'source':'https://www.ensotek.com/','certificateSource':'https://ensotek.com/upload/20/ensotek-iso-9001-belgesi.jpg','missingChannelsSkipped':['linkedin','tiktok'],'oauthGranted':False}))
