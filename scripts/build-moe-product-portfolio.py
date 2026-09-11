#!/usr/bin/env python3
"""Build a printable portfolio only from existing public MOE product names/images."""
from pathlib import Path
import urllib.request,urllib.parse,json,html,hashlib,concurrent.futures
root=Path('/tmp/moe-portfolio-20260910');root.mkdir(exist_ok=True)
origin='https://www.karbonkompozit.com.tr'
copy={
 'tr':('Ürün Portföyü','Projenize uygun kompozit çözümler','Proje ve teklif görüşmesi','Ürün ayrıntıları','Mevcut ürün portföyü; proje ölçüleri, uygulama ve teslim kapsamı teklif görüşmesinde değerlendirilir.'),
 'en':('Product Portfolio','Composite solutions for your project','Discuss your project and request a quote','Product details','Current product portfolio. Project dimensions, application and delivery scope are evaluated during the quotation process.'),
 'de':('Produktportfolio','Verbundwerkstofflösungen für Ihr Projekt','Projekt besprechen und Angebot anfragen','Produktdetails','Aktuelles Produktportfolio. Projektabmessungen, Anwendung und Lieferumfang werden im Angebotsprozess abgestimmt.'),
}
manifest=[]
def download(url):
 p=root/(hashlib.sha256(url.encode()).hexdigest()[:20]+'.img')
 if not p.exists():
  with urllib.request.urlopen(url,timeout=30) as r:
   assert r.headers.get('content-type','').startswith('image/'),url
   p.write_bytes(r.read())
 return p.as_uri()
for locale in ['tr', 'en']:
 t=copy[locale]
 url=origin+'/api/products?'+urllib.parse.urlencode({'locale':locale,'item_type':'kompozit','is_active':'1','limit':'100'})
 with urllib.request.urlopen(urllib.request.Request(url,headers={'Accept-Language':locale}),timeout=30) as r:rows=json.load(r)
 assert isinstance(rows,list) and len(rows)==12
 records=[{'id':r['id'],'title':r['title'],'url':origin+'/'+locale+'/products/'+urllib.parse.quote(r['slug']), 'image':urllib.parse.urljoin(origin,r['image_url'])} for r in rows]
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:images=list(ex.map(download,[r['image'] for r in records]))
 esc=html.escape
 blocks=[]
 for i in range(0,len(records),2):
  cards=[]
  for r,img in zip(records[i:i+2],images[i:i+2]):cards.append(f'<article><img src="{img}" alt="{esc(r["title"])}"><div><h2>{esc(r["title"])}</h2><a href="{esc(r["url"])}">{esc(t[3])} ↗</a><p class="url">{esc(r["url"])}</p></div></article>')
  blocks.append(f'<section class="page"><header><b>MOE KOMPOZIT</b><span>{esc(t[0])} · {i//2+1}/6</span></header>'+''.join(cards)+f'<footer><span>{esc(t[2])} · +90 530 961 94 17</span><span>karbonkompozit.com.tr</span></footer></section>')
 content=f'''<!doctype html><html lang="{locale}"><meta charset="utf-8"><title>MOE Kompozit — {esc(t[0])}</title><style>
 @page {{ size:A4; margin:0 }} * {{box-sizing:border-box}} body {{margin:0;color:#161616;font-family:Arial,sans-serif;background:white}} .page {{width:210mm;height:297mm;padding:16mm 16mm 12mm;page-break-after:always;position:relative}} .page:last-child{{page-break-after:auto}} header{{display:flex;justify-content:space-between;border-bottom:2px solid #b79a57;padding-bottom:6mm;font-size:10px;letter-spacing:.6px}} header b{{font-size:16px}} .cover{{background:#101114;color:#fff;display:flex;flex-direction:column;justify-content:space-between}} .mark{{font-size:25px;letter-spacing:4px;color:#c9a96e;font-weight:bold}} h1{{font-size:48px;line-height:1.08;max-width:160mm;font-weight:500;margin:0 0 10mm}} .cover h2{{font-size:22px;font-weight:400;color:#c9a96e}} .cover p{{font-size:14px;line-height:1.6;max-width:145mm}} .contact{{border-top:1px solid #c9a96e;padding-top:8mm;font-size:14px;line-height:1.8}} .contact a{{color:#fff}} article{{height:119mm;display:grid;grid-template-columns:88mm 1fr;gap:8mm;align-items:center;border-bottom:1px solid #e2e2e2}} article img{{width:88mm;height:96mm;object-fit:contain}} article h2{{font-size:21px;line-height:1.25;margin:0 0 8mm}} article a{{font-size:12px;color:#795f29}} .url{{font-size:9px;color:#6b6b6b;overflow-wrap:anywhere;line-height:1.5}} footer{{position:absolute;bottom:10mm;left:16mm;right:16mm;display:flex;justify-content:space-between;font-size:9px;color:#666}}
 </style><section class="page cover"><div class="mark">MOE KOMPOZIT</div><div><h1>{esc(t[0])}</h1><h2>{esc(t[1])}</h2><p>{esc(t[4])}</p><p>12 · {locale.upper()} · 10.09.2026</p></div><div class="contact">{esc(t[2])}<br>+90 530 961 94 17 · info@karbonkompozit.com.tr<br>Kahramankazan / Ankara · Türkiye<br><a href="{origin}">karbonkompozit.com.tr</a></div></section>{''.join(blocks)}</html>'''
 (root/(locale+'.html')).write_text(content)
 manifest.append({'locale':locale,'source':url,'products':records,'html':str(root/(locale+'.html'))})
Path('output/checklist-2026-09-09/catalog/moe-portfolio-sources.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(json.dumps({'locales':len(manifest),'productsPerLocale':12,'htmlRoot':str(root)}))
