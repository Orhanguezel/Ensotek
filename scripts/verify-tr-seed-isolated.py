#!/usr/bin/env python3
"""Run on vps-Ensotek. Disposable database and account; never touch production rows."""
import subprocess,os,secrets,json
name='checklist_tr_seed_20260910'; user='checklist_tr_seed'
def sql(s):return subprocess.run(['mysql','-NB'],input=s,text=True,capture_output=True,check=True).stdout
assert sql(f"SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name='{name}'").strip()=='0','Refusing existing DB'
password=secrets.token_hex(24)
created=False
try:
 sql(f"CREATE DATABASE {name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");created=True
 sql(f"CREATE USER '{user}'@'localhost' IDENTIFIED BY '{password}'; GRANT ALL ON {name}.* TO '{user}'@'localhost'")
 env={**os.environ,'DB_HOST':'127.0.0.1','DB_PORT':'3306','DB_NAME':name,'DB_USER':user,'DB_PASSWORD':password,'NODE_ENV':'test','ADMIN_EMAIL':'seed-acceptance@example.invalid','ADMIN_ID':'e5909a46-d405-4710-b05c-01376bb34b51','ADMIN_PASSWORD':secrets.token_hex(24),'JWT_SECRET':secrets.token_hex(32),'COOKIE_SECRET':secrets.token_hex(32)}
 cwd='/var/www/Ensotek/ensotek_com_tr/backend'
 for command in [['bun','src/db/seed/index.ts','--no-drop','--only=001,002'],['bun','../../scripts/verify-tr-seed-auth.ts'],['bun','../../scripts/verify-public-signup-roles.ts']]:
  r=subprocess.run(command,cwd=cwd,env=env,text=True,capture_output=True)
  if r.returncode: print(json.dumps({'step':command[1],'ok':False,'error':r.stderr[-3000:]}));raise SystemExit(1)
  if 'scripts/' in command[1]:print(r.stdout.strip())
finally:
 if created:sql(f"DROP DATABASE {name}")
 sql(f"DROP USER IF EXISTS '{user}'@'localhost'")
 print(json.dumps({'isolatedDatabaseRemoved':sql(f"SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name='{name}'").strip()=='0'}))
