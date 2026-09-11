"""Apply two scoped nginx fixes on vps-Ensotek, validating before reload."""
from pathlib import Path
import shutil, subprocess, datetime
stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
changes=[]
for name,addition in [
 ('kuhlturm.com', '\n    # Checklist T11: one public hostname.\n    if ($host = www.kuhlturm.com) { return 301 https://kuhlturm.com$request_uri; }\n'),
 ('karbonkompozit.com.tr', '\n    # Checklist K11: compress text assets served directly by nginx.\n    gzip on;\n    gzip_vary on;\n    gzip_min_length 1024;\n    gzip_types text/plain text/css application/javascript application/json application/xml text/xml image/svg+xml;\n'),
]:
 p=(Path('/etc/nginx/sites-enabled')/name).resolve();original=p.read_text()
 marker='Checklist T11' if name=='kuhlturm.com' else 'Checklist K11'
 if marker in original:continue
 line=next(x for x in original.splitlines() if 'server_name ' in x)
 candidate=original.replace(line,line+addition,1)
 backup_dir=Path('/var/backups/ensotek-checklist/nginx');backup_dir.mkdir(parents=True,exist_ok=True)
 backup=backup_dir/(p.name+'.before-checklist-'+stamp);shutil.copy2(p,backup)
 changes.append((p,original,str(backup)));p.write_text(candidate)
try:
 subprocess.run(['nginx','-t'],check=True)
 subprocess.run(['sudo','systemctl','reload','nginx'],check=True)
except Exception:
 for p,original,_ in changes:p.write_text(original)
 subprocess.run(['nginx','-t'],check=False)
 raise
for p,_,backup in changes:print('UPDATED',p.name,'backup='+backup)
