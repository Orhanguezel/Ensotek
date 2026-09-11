#!/usr/bin/env python3
"""Read-only full public inventory validation. URL encodings compared semantically."""
import sys,json,urllib.request,urllib.parse,xml.etree.ElementTree as ET,concurrent.futures,re
from pathlib import Path
from html.parser import HTMLParser
origin,out=sys.argv[1:3]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.h1=0;self.canonical=None;self.description=None;self.robots='';self.alternates={};self.schemas=[];self.in_schema=False;self.schema_text='';self.links=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='h1':self.h1+=1
  if t=='meta' and a.get('name')=='description':self.description=a.get('content')
  if t=='meta' and a.get('name')=='robots':self.robots=a.get('content','')
  if t=='link' and a.get('rel')=='canonical':self.canonical=a.get('href')
  if t=='link' and a.get('rel')=='alternate' and a.get('hreflang'):self.alternates[a['hreflang']]=a.get('href')
  if t=='a' and a.get('href'):self.links.append(a['href'])
  if t=='script' and a.get('type')=='application/ld+json':self.in_schema=True;self.schema_text=''
 def handle_data(self,s):
  if self.in_schema:self.schema_text+=s
 def handle_endtag(self,t):
  if t=='script' and self.in_schema:
   try:self.schemas.append(json.loads(self.schema_text))
   except ValueError:self.schemas.append({'parseError':True})
   self.in_schema=False
def read(u):
 with urllib.request.urlopen(urllib.parse.quote(u,safe=':/%?=&'),timeout=45) as r:return r.status,r.geturl(),r.read().decode()
def sitemap(u):
 _,_,s=read(u);root=ET.fromstring(s);locs=[e.text for e in root.findall('.//{*}loc')]
 return sum((sitemap(x) for x in locs),[]) if root.tag.endswith('sitemapindex') else locs
def check(u):
 try:
  status,final,s=read(u);p=Page();p.feed(s)
  return dict(url=u,status=status,final=final,canonical=p.canonical,h1=p.h1,description=p.description,robots=p.robots,alternates=p.alternates,schemas=p.schemas,links=p.links,loadingBody=bool(re.search(r'>\s*(Wird geladen|Loading\.\.\.|Yükleniyor)\s*<',s)))
 except Exception as e:return dict(url=u,error=str(e))
urls=list(dict.fromkeys(sitemap(origin+'/sitemap.xml')))
foreign=[u for u in urls if urllib.parse.urlparse(u).netloc!=urllib.parse.urlparse(origin).netloc]
if foreign: raise SystemExit('Sitemap contains foreign hosts: '+str(len(foreign)))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:rows=list(pool.map(check,urls))
Path(out).write_text(json.dumps(rows,ensure_ascii=False,indent=2))
def norm(v):return urllib.parse.unquote(v or '').rstrip('/')
issues=[{k:r.get(k) for k in ['url','error','status','canonical','h1','robots','loadingBody']} for r in rows if r.get('status')!=200 or norm(r.get('canonical'))!=norm(r['url']) or r.get('h1')!=1 or 'noindex' in r.get('robots','') or r.get('loadingBody')]
print(json.dumps({'origin':origin,'urls':len(rows),'issues':issues,'missingDescriptions':sum(not r.get('description') for r in rows),'invalidSchema':sum(any(x.get('parseError') for x in r.get('schemas',[])) for r in rows)},ensure_ascii=False))
