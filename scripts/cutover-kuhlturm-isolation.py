#!/usr/bin/env python3
"""Validated candidate -> live. Run on VPS. Preserve both original databases; rollback on failure."""
import pathlib,subprocess,shutil,time,json,hashlib,urllib.request,datetime
root=pathlib.Path('/var/www/Ensotek/kuhlturm/backend')
base=pathlib.Path('/var/backups/ensotek-kuhlturm-isolation-20260909')
stage=root/'.isolation-stage-20260909'
nginx=pathlib.Path('/etc/nginx/sites-enabled/kuhlturm.com').resolve()
backup=base/('cutover-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'))
backup.mkdir(mode=0o700)
def run(args,**kw):return subprocess.run(args,check=True,capture_output=True,**kw)
def sql(q):return run(['mysql','-NB'],input=q,text=True).stdout
def check(url):
 with urllib.request.urlopen(url,timeout=20) as r:
  if r.status!=200:raise RuntimeError('Health status '+str(r.status))
  return r.read()
for p in ['/api/products?locale=de','/api/services?locale=en']:check('http://127.0.0.1:18089'+p)
assert 'DB_NAME=kuhlturm_live' in (base/'kuhlturm.env.candidate').read_text()
assert (root/'.env').read_bytes()==(base/'kuhlturm.env.before').read_bytes(),'Live env changed after preparation'
old=nginx.read_text()
assert old.count('proxy_pass http://127.0.0.1:8086;')==2,'Unexpected nginx drift'
new=old.replace('proxy_pass http://127.0.0.1:8086;','proxy_pass http://127.0.0.1:8089;').replace('alias /var/www/Ensotek/ensotek_de/backend/uploads/','alias /var/www/Ensotek/kuhlturm/backend/uploads/')
start=new.index('    # services + products modülleri:')
end=new.index('    location ^~ /api/services',start)
new=new[:start]+'    # Native Kühlturm products/services use the isolated kuhlturm_live database.\n'+new[end:]
shutil.copy2(nginx,backup/'nginx.before')
shutil.copy2(root/'.env',backup/'env.before')
shutil.copytree(root/'dist',backup/'dist')
shutil.copy2(root/'src/routes/shared.ts',backup/'shared.ts')
for name in ['products','services']:
 if (root/'src/modules'/name).exists():shutil.copytree(root/'src/modules'/name,backup/('src-'+name))
changed=False
try:
 # Briefly reject mutations on this vhost; GETs and the Ensotek DE vhost stay available.
 frozen=old.replace('    server_name kuhlturm.com www.kuhlturm.com;','    server_name kuhlturm.com www.kuhlturm.com;\n    if ($request_method !~ ^(GET|HEAD|OPTIONS)$) { return 503; }',1)
 nginx.write_text(frozen);run(['nginx','-t']);run(['systemctl','reload','nginx']);time.sleep(3)
 comparisons=[]
 for table in ['contact_messages','catalog_requests','offers','offer_number_counters','users','profiles','user_roles','support_tickets','ticket_replies','newsletter_subscribers']:
  cols=sql("SELECT column_name FROM information_schema.columns WHERE table_schema='ensotek' AND table_name='"+table+"' ORDER BY ordinal_position").splitlines()
  expr=','.join('`'+c+'`' for c in cols)
  def digest(db):return hashlib.sha256(sql('SELECT '+expr+' FROM '+db+'.`'+table+'` ORDER BY '+expr).encode()).hexdigest()
  assert digest('ensotek')==digest('kuhlturm_live'),'Source changed: '+table+'; reconcile before retry'
  comparisons.append(table)
 for name in ['products','services']:
  shutil.copytree(stage/'dist/modules'/name,root/'dist/modules'/name,dirs_exist_ok=True)
  shutil.copytree(stage/'src/modules'/name,root/'src/modules'/name,dirs_exist_ok=True)
 shutil.copy2(stage/'dist/routes/shared.js',root/'dist/routes/shared.js')
 shutil.copy2(stage/'src/routes/shared.ts',root/'src/routes/shared.ts')
 shutil.copy2(base/'kuhlturm.env.candidate',root/'.env')
 changed=True
 run(['pm2','restart','kuhlturm-backend','--update-env'])
 healthy=False
 for _ in range(12):
  try:
   for path in ['/api/products?locale=de','/api/services?locale=en']:check('http://127.0.0.1:8089'+path)
   healthy=True;break
  except Exception:time.sleep(1)
 if not healthy:raise RuntimeError('Backend health failed')
 nginx.write_text(new);run(['nginx','-t']);run(['systemctl','reload','nginx'])
 for path in ['/api/products?locale=de','/api/services?locale=en','/de','/en']:check('https://kuhlturm.com'+path)
 # Negative access test through the application's scoped database credential.
 denied=subprocess.run(['mysql','--defaults-extra-file='+str(base/'client.cnf'),'-NBe','SELECT COUNT(*) FROM ensotek.site_settings'],capture_output=True)
 assert denied.returncode!=0,'Cross-database access unexpectedly allowed'
 run(['pm2','save'])
 print(json.dumps({'cutover':True,'backup':str(backup),'database':'kuhlturm_live','apiPort':8089,'uploadsIndependent':True,'businessTablesUnchanged':comparisons,'crossDatabaseAccessDenied':True}))
except Exception:
 nginx.write_text(old)
 if changed:
  shutil.rmtree(root/'dist');shutil.copytree(backup/'dist',root/'dist')
  shutil.copy2(backup/'env.before',root/'.env');shutil.copy2(backup/'shared.ts',root/'src/routes/shared.ts')
  for name in ['products','services']:
   shutil.rmtree(root/'src/modules'/name,ignore_errors=True)
   if (backup/('src-'+name)).exists():shutil.copytree(backup/('src-'+name),root/'src/modules'/name)
  run(['pm2','restart','kuhlturm-backend','--update-env'])
 run(['nginx','-t']);run(['systemctl','reload','nginx'])
 raise
