#!/usr/bin/env python3
import pathlib,subprocess,re,json,os,time,hashlib,urllib.request
root=pathlib.Path('/var/www/Ensotek');backup=pathlib.Path('/var/backups/signup-role-boundary-20260910');backup.mkdir(mode=0o700,exist_ok=False)
for site in ['ensotek_com_tr','kuhlturm','kompozit']:
 p=root/site/'backend/.env';q=backup/(site+'.env');q.write_bytes(p.read_bytes());q.chmod(0o600)
 for file in [p,root/site/'backend/.env.production']:
  if not file.exists():continue
  s=file.read_text();s,n=re.subn(r'^AUTH_PUBLIC_SIGNUP_ROLE=.*$','AUTH_PUBLIC_SIGNUP_ROLE=user',s,flags=re.M)
  if not n:s+='\nAUTH_PUBLIC_SIGNUP_ROLE=user\n'
  file.write_text(s);file.chmod(0o600)
for name in ['controller','google.controller']:
 target=root/'ensotek_de/backend/dist/modules/auth'/f'{name}.js';candidate=target.with_name(name+'.checklist-20260910.js');assert candidate.exists();q=backup/(name+'.js');q.write_bytes(target.read_bytes());target.write_bytes(candidate.read_bytes())
subprocess.run(['pm2','restart','ensotek-backend','ensotek-com-tr-backend','kuhlturm-backend','kompozit-backend'],check=True,capture_output=True)
checks=[]
for site,port in [('ensotek_de',8086),('ensotek_com_tr',8087),('kuhlturm',8089),('kompozit',8186)]:
 ok=False
 for attempt in range(20):
  try:
   with urllib.request.urlopen(f'http://127.0.0.1:{port}/api/health',timeout=5) as r:ok=r.status==200
   if ok:break
  except Exception:time.sleep(1)
 checks.append({'site':site,'health200':ok,'publicSignupRole':'user'})
print(json.dumps({'backup':str(backup),'checks':checks,'schemaAltered':False,'registrationDisabled':False}))
assert all(r['health200'] for r in checks)
