#!/usr/bin/env python3
"""Read-only live DB audit; report matching row IDs/columns, never content or credentials."""
import subprocess,json
from pathlib import Path
def sql(q):
 r=subprocess.run(['mysql','-NBr','ensotek'],input=q,text=True,capture_output=True,check=True);return r.stdout
columns=[line.split('\t') for line in sql("SELECT TABLE_NAME,COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='ensotek' AND TABLE_NAME IN ('menu_items','menu_items_i18n','custom_pages','custom_pages_i18n','footer_sections','footer_sections_i18n') AND DATA_TYPE IN ('varchar','text','longtext','mediumtext','json')").splitlines()]
findings=[]
for table,col in columns:
 rows=sql(f"SELECT id FROM `{table}` WHERE LOWER(`{col}`) REGEXP '\\\\[(slug|locale)\\\\]|%5b(slug|locale)%5d' LIMIT 100").splitlines()
 if rows:findings.append({'table':table,'column':col,'ids':rows})
print(json.dumps({'database':'ensotek','columnsChecked':len(columns),'findings':findings}))
