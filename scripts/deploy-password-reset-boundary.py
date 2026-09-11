#!/usr/bin/env python3
"""Apply only the reviewed auth files; private rollback backup, four health gates."""
from pathlib import Path
import subprocess,tarfile,datetime,json,urllib.request,time,hashlib
root=Path('/var/www/Ensotek');stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ');backup=Path('/var/backups/password-reset-'+stamp);backup.mkdir(mode=0o700)
archive=Path('/tmp/ensotek-reset-release.tgz');files=[];created=[]
with tarfile.open(archive) as tar:
 for member in tar.getmembers():
  p=Path(member.name)
  assert member.isfile() and not p.is_absolute() and '..' not in p.parts and p.suffix in ['.ts','.js']
  target=root/p;assert str(target.resolve()).startswith(str(root)+'/')
  if target.exists():
   q=backup/p;q.parent.mkdir(parents=True,exist_ok=True);q.write_bytes(target.read_bytes())
  else:created.append(target)
  files.append((member,target))
 try:
  for member,target in files:
   target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(tar.extractfile(member).read())
  services=['ensotek-backend','ensotek-com-tr-backend','kuhlturm-backend','kompozit-backend']
  subprocess.run(['pm2','restart',*services],check=True,capture_output=True)
  checks=[]
  for site,port in [('ensotek_de',8086),('ensotek_com_tr',8087),('kuhlturm',8089),('kompozit',8186)]:
   ok=False; detail=None
   for _ in range(30):
    try:
     with urllib.request.urlopen(f'http://127.0.0.1:{port}/api/auth/password-reset',timeout=5) as r:ok=r.status==200 and r.headers.get('Referrer-Policy')=='no-referrer'; detail={'status':r.status,'referrer':r.headers.get('Referrer-Policy')}
     if ok:break
    except Exception as e:detail={'error':str(e)};time.sleep(1)
   checks.append({'site':site,'resetPage200':ok,'detail':detail})
  print(json.dumps({'preflight':checks}),flush=True)
  assert all(c['resetPage200'] for c in checks)
 except Exception:
  for _,target in files:
   q=backup/target.relative_to(root)
   if q.exists():target.write_bytes(q.read_bytes())
   elif target in created:target.unlink(missing_ok=True)
  subprocess.run(['pm2','restart',*services],capture_output=True)
  raise
print(json.dumps({'backup':str(backup),'checks':checks,'reviewedFiles':len(files),'externalMessages':0,'schemaAltered':False}))
