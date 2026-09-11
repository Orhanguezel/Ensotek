#!/usr/bin/env python3
"""Warm existing Next image variants used by the visible hero; no source image mutation."""
import urllib.request,urllib.parse,json,re,sys
from html.parser import HTMLParser
class Images(HTMLParser):
 def __init__(self):super().__init__();self.urls=[]
 def handle_starttag(self,t,a):
  a=dict(a)
  if t!='img' or a.get('fetchpriority')!='high':return
  choices=[]
  for item in a.get('srcset','').split(','):
   parts=item.strip().rsplit(' ',1)
   if len(parts)==2 and parts[1].endswith('w'):choices.append((int(parts[1][:-1]),parts[0]))
  if choices:
   for desired in [750,1080]:self.urls.append(next((url for width,url in choices if width>=desired),choices[-1][1]))
  elif a.get('src'):self.urls.append(a['src'])
site=sys.argv[1]
base,locale={'kuhlturm':('https://kuhlturm.com','de'),'kompozit':('https://www.karbonkompozit.com.tr','tr'),'ensotek_de':('https://ensotek.de','de')}[site]
p=Images()
page_path=sys.argv[2] if len(sys.argv)>2 else '/'+locale
assert page_path.startswith('/') and not page_path.startswith('//')
with urllib.request.urlopen(base+page_path,timeout=30) as r:p.feed(r.read().decode())
out=[]
for raw in dict.fromkeys(p.urls):
 url=urllib.parse.urljoin(base,raw)
 if urllib.parse.urlparse(url).netloc!=urllib.parse.urlparse(base).netloc or '/_next/image?' not in url:continue
 req=urllib.request.Request(url,headers={'Accept':'image/avif,image/webp,image/*,*/*;q=0.8'})
 with urllib.request.urlopen(req,timeout=60) as r:
  body=r.read();out.append({'url':url,'status':r.status,'contentType':r.headers.get('content-type'),'bytes':len(body),'cache':r.headers.get('x-nextjs-cache')})
print(json.dumps({'site':site,'purpose':'Prepare production hero optimizer cache for first visitors after deployment','variants':out}))
