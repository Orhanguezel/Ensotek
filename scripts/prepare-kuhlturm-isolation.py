#!/usr/bin/env python3
"""Run on vps-Ensotek. Prepare a new database, scoped account and private backups. No cutover."""
import subprocess, pathlib, secrets, json, os, re
root=pathlib.Path('/var/www/Ensotek/kuhlturm/backend')
backup=pathlib.Path('/var/backups/ensotek-kuhlturm-isolation-20260909')
backup.mkdir(mode=0o700,exist_ok=False)
def sql(query):return subprocess.run(['mysql','-NB'],input=query,text=True,capture_output=True,check=True).stdout
if sql("SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name='kuhlturm_live'").strip()!='0':raise SystemExit('Target database already exists; inspect before proceeding')
for name in ['ensotek','kuhlturm']:
 with (backup/(name+'.sql')).open('xb') as f:
  os.chmod(f.name,0o600)
  subprocess.run(['mysqldump','--single-transaction','--skip-lock-tables','--hex-blob','--no-tablespaces','--set-gtid-purged=OFF',name],stdout=f,check=True)
(backup/'kuhlturm.env.before').write_bytes((root/'.env').read_bytes());os.chmod(backup/'kuhlturm.env.before',0o600)
sql('CREATE DATABASE kuhlturm_live CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')
with (backup/'ensotek.sql').open('rb') as f:subprocess.run(['mysql','kuhlturm_live'],stdin=f,check=True)
password=secrets.token_hex(32)
for host in ['localhost','127.0.0.1']:
 sql("CREATE USER 'kuhlturm_runtime'@'"+host+"' IDENTIFIED BY '"+password+"'")
 sql("GRANT ALL PRIVILEGES ON kuhlturm_live.* TO 'kuhlturm_runtime'@'"+host+"'")
s=(root/'.env').read_text()
for key,value in {'DB_NAME':'kuhlturm_live','DB_USER':'kuhlturm_runtime','DB_PASSWORD':password,'LOCAL_STORAGE_ROOT':str(root/'uploads')}.items():
 s,n=re.subn(r'^'+key+r'=.*$',key+'='+value,s,flags=re.M)
 if not n:s+='\n'+key+'='+value+'\n'
(backup/'kuhlturm.env.candidate').write_text(s);os.chmod(backup/'kuhlturm.env.candidate',0o600)
cnf=backup/'client.cnf';cnf.write_text('[client]\nhost=127.0.0.1\nuser=kuhlturm_runtime\npassword='+password+'\ndatabase=kuhlturm_live\n');os.chmod(cnf,0o600)
result=subprocess.run(['mysql','--defaults-extra-file='+str(cnf),'-NBe','SELECT COUNT(*) FROM ensotek.site_settings'],capture_output=True,text=True)
if result.returncode==0:raise SystemExit('Isolation failed: candidate user can read ensotek')
(root/'uploads').mkdir(exist_ok=True)
subprocess.run(['rsync','-a','--ignore-existing','/var/www/Ensotek/ensotek_de/backend/uploads/',str(root/'uploads')+'/'],check=True)
print(json.dumps({'prepared':True,'sourceDatabase':'ensotek','targetDatabase':'kuhlturm_live','oldKuhlturmDatabasePreserved':True,'backup':str(backup),'crossDatabaseAccessDenied':True,'uploadsCopied':True}))
