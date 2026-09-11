#!/usr/bin/env python3
import concurrent.futures,json,urllib.request,urllib.parse,datetime
from html.parser import HTMLParser
from pathlib import Path
class Page(HTMLParser):
 def __init__(self):super().__init__();self.canonical=None;self.h1=0;self.schema=0
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='h1':self.h1+=1
  if t=='link' and a.get('rel')=='canonical':self.canonical=a.get('href')
  if t=='script' and a.get('type')=='application/ld+json':self.schema+=1
urls=[x['url'] for x in json.loads(Path('output/checklist-2026-09-09/kuhlturm-full-live-crawl.json').read_text())]
def check(u):
 try:
  with urllib.request.urlopen(urllib.parse.quote(u,safe=":/%?=&"),timeout=40) as r:body=r.read().decode();status=r.status
  p=Page();p.feed(body);return dict(url=u,status=status,canonical=p.canonical,h1=p.h1,schema=p.schema)
 except Exception as e:return dict(url=u,error=str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:rows=list(pool.map(check,urls))
failed=[r for r in rows if r.get('status')!=200 or urllib.parse.unquote(r.get('canonical') or '')!=urllib.parse.unquote(r['url']) or r.get('h1')!=1 or not r.get('schema')]
Path('output/checklist-2026-09-09/isolation/public-crawl.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
print(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'checked':len(rows),'failed':failed},ensure_ascii=False))
