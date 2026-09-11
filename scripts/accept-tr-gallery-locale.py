import json,sys,re,urllib.request,urllib.error,html as H
base=sys.argv[1]; out={"base":base}; ok=True
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*a,**k): return None
def get(path):
    try: r=urllib.request.build_opener(NoRedirect).open(urllib.request.Request(base+path,headers={"User-Agent":"accept-check"}),timeout=90); return r.status,dict(r.headers),r.read().decode("utf-8","replace")
    except urllib.error.HTTPError as e: return e.code,dict(e.headers),e.read().decode("utf-8","replace")
def info(body):
    lang=re.search(r'<html[^>]*\slang="([^"]*)"',body); h1=re.search(r'<h1[^>]*>(.*?)</h1>',body,re.S)
    return {"lang":lang.group(1) if lang else None,"h1":H.unescape(re.sub('<[^>]+>','',h1.group(1))).strip()[:60] if h1 else None,"links":sorted(set(re.findall(r'href="(/[a-z]{2}/(?:gallery|galeri)/[^"#?]+)"',body)))}
SEG={"tr":"galeri","en":"gallery"}  # next-intl yerelleştirilmiş yol
for loc in ("tr","en"):
    st,hd,b=get(f"/{loc}/{SEG[loc]}"); i=info(b); i["status"]=st; out[f"list_{loc}"]=i
    ok &= st==200 and i["lang"]==loc and len(i["links"])==4 and all(l.startswith(f"/{loc}/{SEG[loc]}/") for l in i["links"])
c={}
st,hd,b=get("/en/gallery/field-installations"); c["en_detail"]={"status":st,**info(b)}; ok &= st==200 and c["en_detail"]["lang"]=="en" and "Field" in (c["en_detail"]["h1"] or "")
st,hd,b=get("/en/gallery/saha-uygulamalari"); c["en_with_tr_slug"]={"status":st,"location":hd.get("Location") or hd.get("location")}; ok &= st in (301,308) and (c["en_with_tr_slug"]["location"] or "").endswith("/en/gallery/field-installations")
st,hd,b=get("/tr/galeri/field-installations"); c["tr_with_en_slug"]={"status":st,"location":hd.get("Location") or hd.get("location")}; ok &= st in (301,308) and (c["tr_with_en_slug"]["location"] or "").endswith("/tr/galeri/saha-uygulamalari")
st,hd,b=get("/en/gallery/nope-xyz"); c["en_missing"]={"status":st}; ok &= st==404
st,hd,b=get("/en/gallery/open-circuit-cooling-towers"); alts=re.findall(r'<link[^>]*rel="alternate"[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"',b,re.I); c["en_detail_hreflang"]=alts
ok &= any(l=="tr" and h.endswith("/tr/galeri/acik-devre-sogutma-kuleleri") for l,h in alts) and any(l=="en" and h.endswith("/en/gallery/open-circuit-cooling-towers") for l,h in alts)
out["checks"]=c
st,hd,b=get("/sitemap.xml"); urls=re.findall(r'<loc>([^<]+)</loc>',b); en=[u for u in urls if "/en/gallery/" in u]; tr=[u for u in urls if "/tr/galeri/" in u]
out["sitemap"]={"status":st,"tr_gallery":len(tr),"en_gallery":len(en),"total":len(urls),"en_with_tr_slug":sorted({u.rsplit('/',1)[1] for u in en} & {u.rsplit('/',1)[1] for u in tr})}
ok &= st==200 and len(en)==4 and len(tr)==4 and not out["sitemap"]["en_with_tr_slug"]
out["pass"]=bool(ok); print(json.dumps(out,indent=1,ensure_ascii=False))
