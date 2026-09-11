#!/usr/bin/env python3
"""Run on vps-Ensotek. No values logged; retire exposed DB credential and MOE sessions."""
import pathlib,subprocess,secrets,re,json,os,time,urllib.request,urllib.error,hashlib,hmac,base64
root=pathlib.Path('/var/www/Ensotek');stamp=time.strftime('%Y%m%dT%H%M%SZ',time.gmtime());backup=pathlib.Path('/var/backups')/('ensotek-exposed-secret-'+stamp);backup.mkdir(mode=0o700)
def sql(q):return subprocess.run(['mysql','-NB'],input=q,text=True,capture_output=True,check=True).stdout.strip()
def read(p):
 return {k.strip():v.strip().strip(chr(34)+chr(39)) for l in p.read_text().splitlines() if '=' in l and not l.lstrip().startswith('#') for k,v in [l.split('=',1)]}
def write(p,updates):
 s=p.read_text()
 for k,v in updates.items():
  s,n=re.subn(r'^'+re.escape(k)+r'\s*=.*$',k+'='+v,s,flags=re.M)
  if not n:s+='\n'+k+'='+v+'\n'
 p.write_text(s);p.chmod(0o600)
assert sql("SELECT COUNT(*) FROM mysql.user WHERE user='kompozit_runtime'")=='0','Account already exists; inspect before rerun'
assert sql('SELECT COUNT(*) FROM kompozit.user_google_accounts')=='0','JWT encrypted Google tokens need migration first'
paths={site:root/site/'backend/.env' for site in ['ensotek_de','ensotek_com_tr','kompozit']};old={site:read(p) for site,p in paths.items()}
assert all(v.get('DB_USER')=='ensotek' for v in old.values())
assert len({v['DB_PASSWORD'] for v in old.values()})==1
for site,p in paths.items():
 q=backup/(site+'.env');q.write_bytes(p.read_bytes());q.chmod(0o600)
newdb=secrets.token_hex(32);moedb=secrets.token_hex(32);jwt=secrets.token_hex(48);cookie=secrets.token_hex(48)
# Random hex strings contain no SQL quote characters.
sql("CREATE USER 'kompozit_runtime'@'localhost' IDENTIFIED BY '"+moedb+"'; GRANT ALL ON kompozit.* TO 'kompozit_runtime'@'localhost'")
# First replace every known consumer config, then change shared password and restart.
for site in ['ensotek_de','ensotek_com_tr']:write(paths[site],{'DB_PASSWORD':newdb})
updates={'DB_USER':'kompozit_runtime','DB_PASSWORD':moedb,'JWT_SECRET':jwt,'COOKIE_SECRET':cookie,'ALLOW_TEMP_LOGIN':'0','TEMP_PASSWORD':'','SEED_ADMIN_PASSWORD':'','CLOUDINARY_API_KEY':'','CLOUDINARY_API_SECRET':''}
write(paths['kompozit'],updates)
prod=root/'kompozit/backend/.env.production'
if prod.exists():
 q=backup/'kompozit.env.production';q.write_bytes(prod.read_bytes());q.chmod(0o600);write(prod,updates)
sql("ALTER USER 'ensotek'@'localhost' IDENTIFIED BY '"+newdb+"'; REVOKE ALL PRIVILEGES ON kompozit.* FROM 'ensotek'@'localhost'")
revoked=int(sql('SELECT COUNT(*) FROM kompozit.refresh_tokens WHERE revoked_at IS NULL'))
sql('UPDATE kompozit.refresh_tokens SET revoked_at=UTC_TIMESTAMP(3) WHERE revoked_at IS NULL')
subprocess.run(['pm2','restart','ensotek-backend','ensotek-com-tr-backend','kompozit-backend'],capture_output=True,check=True)
checks=[]
for port in [8086,8087,8186]:
 ok=False
 for attempt in range(20):
  try:
   with urllib.request.urlopen(f'http://127.0.0.1:{port}/api/health',timeout=5) as r:ok=r.status==200
   if ok:break
  except Exception:time.sleep(1)
 checks.append({'port':port,'health200':ok})
def client(user,password,q):
 f=backup/'probe.cnf';f.write_text('[client]\nhost=127.0.0.1\nuser='+user+'\npassword='+password+'\n');f.chmod(0o600)
 r=subprocess.run(['mysql','--defaults-extra-file='+str(f),'-NBe',q],capture_output=True);f.unlink();return r.returncode==0
checks.append({'retiredPasswordRejected':not client('ensotek',old['kompozit']['DB_PASSWORD'],'SELECT 1'),'moeOwnDb':client('kompozit_runtime',moedb,'SELECT COUNT(*) FROM kompozit.site_settings'),'moeCannotReadEnsotek':not client('kompozit_runtime',moedb,'SELECT COUNT(*) FROM ensotek.site_settings'),'oldAccountCannotReadMoe':not client('ensotek',newdb,'SELECT COUNT(*) FROM kompozit.site_settings')})
admin=sql("SELECT user_id FROM kompozit.user_roles WHERE role='admin' LIMIT 1")
def token(secret):
 enc=lambda o:base64.urlsafe_b64encode(json.dumps(o,separators=(',',':')).encode()).decode().rstrip('=')
 raw=enc({'alg':'HS256','typ':'JWT'})+'.'+enc({'sub':admin,'role':'admin','exp':int(time.time())+120})
 return raw+'.'+base64.urlsafe_b64encode(hmac.new(secret.encode(),raw.encode(),hashlib.sha256).digest()).decode().rstrip('=')
def adminstatus(secret):
 try:
  with urllib.request.urlopen(urllib.request.Request('http://127.0.0.1:8186/api/admin/offers?limit=1',headers={'Authorization':'Bearer '+token(secret)})) as r:return r.status
 except urllib.error.HTTPError as e:return e.code
checks.append({'oldJwtStatus':adminstatus(old['kompozit']['JWT_SECRET']),'newJwtStatus':adminstatus(jwt),'refreshTokensRevoked':revoked,'activeRefreshTokens':int(sql('SELECT COUNT(*) FROM kompozit.refresh_tokens WHERE revoked_at IS NULL'))})
# Restrict stale server dotenv copies; retain private rollback evidence.
restricted=0
for site in ['ensotek_de','ensotek_com_tr','kompozit','kuhlturm']:
 for p in (root/site/'backend').glob('.env*'):
  if p.is_file():p.chmod(0o600);restricted+=1
print(json.dumps({'backup':str(backup),'checks':checks,'dotenvFilesRestricted':restricted,'externalCloudinaryRevocation':'pending-provider-access','erpRestarted':False}))
assert all(x.get('health200',True) for x in checks)
assert checks[-2]['retiredPasswordRejected'] and checks[-2]['moeOwnDb'] and checks[-2]['moeCannotReadEnsotek'] and checks[-2]['oldAccountCannotReadMoe']
assert checks[-1]['oldJwtStatus']==401 and checks[-1]['newJwtStatus']==200 and checks[-1]['activeRefreshTokens']==0
