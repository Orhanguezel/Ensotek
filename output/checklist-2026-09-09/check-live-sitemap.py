"""Read-only live acceptance; no form submission or external messages."""
import requests, xml.etree.ElementTree as ET, json, concurrent.futures, time
from bs4 import BeautifulSoup
from pathlib import Path
from urllib.parse import unquote
site='https://kuhlturm.com'
root=ET.fromstring(requests.get(site+'/sitemap.xml',timeout=45).content)
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls=[n.text for n in root.findall('s:url/s:loc',ns)]
def check(url):
 try:
  time.sleep(0.15)
  r=requests.get(url,timeout=45,headers={'User-Agent':'Ensotek-Checklist-Acceptance/1.0'},allow_redirects=False)
  soup=BeautifulSoup(r.text,'html.parser');c=soup.find('link',rel='canonical')
  return dict(url=url,status=r.status_code,canonical=c.get('href') if c else None,h1=len(soup.find_all('h1')),schema=len(soup.select('script[type="application/ld+json"]')),alternates={a.get('hreflang'):a.get('href') for a in soup.select('link[hreflang]')})
 except Exception as e:return dict(url=url,error=type(e).__name__)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:rows=list(pool.map(check,urls))
Path(__file__).with_name('kuhlturm-full-live-crawl.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
failures=[r for r in rows if r.get('status')!=200 or unquote(r.get('canonical') or '')!=unquote(r['url'])]
print(json.dumps(dict(checked=len(rows),failures=failures),ensure_ascii=False))
