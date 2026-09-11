import json,sys,re,urllib.request,urllib.error,html as H
base=sys.argv[1]; out={"base":base}; ok=True
def get(path, follow=False):
    req=urllib.request.Request(base+path, headers={"User-Agent":"accept-check"})
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self,*a,**k): return None
    opener=urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
    try:
        r=opener.open(req, timeout=90); return r.status, dict(r.headers), r.read().decode("utf-8","replace")
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read().decode("utf-8","replace")
def page_info(body):
    lang=re.search(r'<html[^>]*\slang="([^"]*)"',body); h1=re.search(r'<h1[^>]*>(.*?)</h1>',body,re.S)
    links=sorted(set(re.findall(r'href="(/[a-z]{2}/blog/[^"#?]+)"',body)))
    titles=[H.unescape(re.sub('<[^>]+>','',x)).strip() for x in re.findall(r'<h2[^>]*>(.*?)</h2>',body,re.S)]
    return {"lang":lang.group(1) if lang else None,"h1":H.unescape(re.sub('<[^>]+>','',h1.group(1))).strip()[:60] if h1 else None,"links":links,"h2":titles[:10]}
# 1) listeler
for loc in ("tr","en"):
    st,hd,body=get(f"/{loc}/blog"); info=page_info(body); info["status"]=st; out[f"list_{loc}"]=info
    foreign=[l for l in info["links"] if not l.startswith(f"/{loc}/")]
    ok &= st==200 and info["lang"]==loc and len(info["links"])==9 and not foreign
tr_titles=set(out["list_tr"]["h2"]); en_titles=set(out["list_en"]["h2"])
out["en_list_has_turkish_titles"]=sorted(tr_titles & en_titles); ok &= not (tr_titles & en_titles)
# 2) detaylar
checks={}
st,hd,body=get("/en/blog/cooling-tower-selection-guide"); checks["en_detail"]={"status":st,**{k:v for k,v in page_info(body).items() if k in ('lang','h1')}}; ok &= st==200 and checks["en_detail"]["lang"]=="en" and "Selection Guide" in (checks["en_detail"]["h1"] or "")
st,hd,body=get("/en/blog/sogutma-kulesi-secim-rehberi"); checks["en_with_tr_slug"]={"status":st,"location":hd.get("Location") or hd.get("location")}; ok &= st in (301,308) and (checks["en_with_tr_slug"]["location"] or "").endswith("/en/blog/cooling-tower-selection-guide")
st,hd,body=get("/tr/blog/cooling-tower-selection-guide"); checks["tr_with_en_slug"]={"status":st,"location":hd.get("Location") or hd.get("location")}; ok &= st in (301,308) and (checks["tr_with_en_slug"]["location"] or "").endswith("/tr/blog/sogutma-kulesi-secim-rehberi")
st,hd,body=get("/tr/blog/sogutma-kulesi-secim-rehberi"); checks["tr_detail"]={"status":st,**{k:v for k,v in page_info(body).items() if k in ('lang','h1')}}; ok &= st==200 and checks["tr_detail"]["lang"]=="tr"
st,hd,body=get("/en/blog/does-not-exist-xyz"); checks["en_missing"]={"status":st}; ok &= st==404
# hreflang on EN detail
st,hd,body=get("/en/blog/features-of-ensotek-cooling-towers"); alts=re.findall(r'<link[^>]*rel="alternate"[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"',body,re.I)
checks["en_detail_hreflang"]=alts; ok &= any(l=="tr" and h.endswith("/tr/blog/ensotek-sogutma-kulelerinin-ozellikleri") for l,h in alts) and any(l=="en" and h.endswith("/en/blog/features-of-ensotek-cooling-towers") for l,h in alts)
out["checks"]=checks
# 3) sitemap
st,hd,body=get("/sitemap.xml"); urls=re.findall(r'<loc>([^<]+)</loc>',body); en_blog=[u for u in urls if "/en/blog/" in u]; tr_blog=[u for u in urls if "/tr/blog/" in u]
tr_slugs={u.rsplit('/',1)[1] for u in tr_blog}; en_slugs={u.rsplit('/',1)[1] for u in en_blog}
out["sitemap"]={"status":st,"tr_blog":len(tr_blog),"en_blog":len(en_blog),"en_entries_with_tr_slug":sorted(en_slugs & tr_slugs),"hreflang_count":body.count("hreflang=")}
ok &= st==200 and len(en_blog)==9 and len(tr_blog)==9 and not (en_slugs & tr_slugs)
out["pass"]=bool(ok); print(json.dumps(out,indent=1,ensure_ascii=False))
