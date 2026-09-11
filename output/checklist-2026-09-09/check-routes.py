import requests,xml.etree.ElementTree as E,bs4,json,concurrent.futures
from pathlib import Path
rows=[]; counts={}; ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
for port in [3425,3420]:
 xml=requests.get(f'http://127.0.0.1:{port}/sitemap.xml',timeout=30).text;root=E.fromstring(xml);urls=[e.text for e in root.findall('s:url/s:loc',ns)];counts[port]=len(urls)
 selected={}
 for url in urls:
  path='/'+url.split('/',3)[3];parts=path.split('/');key='/'.join(parts[1:3])+('/detail' if len(parts)>3 else '')
  selected.setdefault(key,(url,path))
 def test(pair):
  expected,path=pair
  try:
   res=requests.get(f'http://127.0.0.1:{port}'+path,timeout=30,headers={'User-Agent':'Googlebot'},allow_redirects=False);doc=bs4.BeautifulSoup(res.text,'html.parser');tag=doc.find('link',rel='canonical');canonical=tag.get('href') if tag else None
   return dict(port=port,path=path,status=res.status_code,canonical=canonical,canonical_ok=canonical==expected,h1=len(doc.find_all('h1')),schema=len(doc.select('script[type="application/ld+json"]')))
  except Exception as e:return dict(port=port,path=path,error=str(e))
 rows.extend(concurrent.futures.ThreadPoolExecutor(max_workers=4).map(test,selected.values()))
result=dict(counts=counts,checked=len(rows),rows=rows)
Path(__file__).with_name('route-acceptance.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print('Sitemaps',counts,'Checked',len(rows),'routes');print(json.dumps([x for x in rows if x.get('status')!=200 or not x.get('canonical_ok')],ensure_ascii=False,indent=2))
