import json, sys
from playwright.sync_api import sync_playwright
base, out = sys.argv[1], sys.argv[2]
image_proxy = sys.argv[3] if len(sys.argv) > 3 else None  # yerel adayda /uploads yok: optimizer isteklerini canliya yonlendir
res={"base":base}
with sync_playwright() as p:
    b=p.chromium.launch(channel="chromium", args=["--headless=new"])
    for name,vp,mobile in (("desktop",{"width":1440,"height":900},False),("mobile",{"width":390,"height":844},True)):
        ctx=b.new_context(viewport=vp, is_mobile=mobile, has_touch=mobile, device_scale_factor=2 if mobile else 1); page=ctx.new_page()
        errors=[]; page.on("pageerror", lambda e: errors.append(str(e)))
        if image_proxy:
            def proxy(route):
                url=route.request.url
                if "/_next/image" in url or "/uploads/" in url:
                    r=route.fetch(url=url.replace(base, image_proxy)); route.fulfill(response=r)
                else: route.continue_()
            page.route("**/*", proxy)
        res.setdefault("imageProxy", image_proxy)
        page.goto(f"{base}/tr", wait_until="load", timeout=60000); page.wait_for_timeout(1200)
        for n in ("Reject","Reddet"):
            bt=page.get_by_role("button", name=n, exact=True)
            if bt.count(): bt.first.click(); break
        page.wait_for_timeout(300)
        info=page.evaluate("""() => { const a=document.querySelector('aside[aria-labelledby="hero-showcase-heading"]'); if(!a) return {present:false};
          const tiles=[...a.querySelectorAll('a[href*="/products/"]')].filter(x=>x.querySelector('img'));
          const imgs=tiles.map(t=>{const i=t.querySelector('img'); const r=t.getBoundingClientRect(); return {href:t.getAttribute('href'), alt:i.alt, fetchpriority:i.getAttribute('fetchpriority'), loading:i.getAttribute('loading'), src:(i.currentSrc||i.src).slice(0,90), complete:i.complete&&i.naturalWidth>0, w:Math.round(r.width), h:Math.round(r.height), top:Math.round(r.top)}});
          const chips=[...a.querySelectorAll('ul a')].map(x=>({text:x.textContent.trim(), href:x.getAttribute('href')}));
          const h1=document.querySelector('h1'); const hero=document.querySelector('section.hero').getBoundingClientRect();
          return {present:true, heading:a.querySelector('#hero-showcase-heading').textContent, viewAll:a.querySelector('a[href$="/products"]')?.textContent.trim(), tiles:imgs, chips, heroHeight:Math.round(hero.height), overflowX:document.documentElement.scrollWidth>innerWidth, h1:h1&&h1.textContent.trim().slice(0,40)}; }""")
        page.screenshot(path=f"{out}-{name}-dark.png", clip={"x":0,"y":0,"width":vp["width"],"height":min(1400, page.evaluate("document.querySelector('section.hero').getBoundingClientRect().bottom+40"))})
        light=None
        tb=page.get_by_role("button", name="Switch to light mode")
        if tb.count(): tb.first.click(); page.wait_for_timeout(500); page.screenshot(path=f"{out}-{name}-light.png", clip={"x":0,"y":0,"width":vp["width"],"height":min(1400, page.evaluate("document.querySelector('section.hero').getBoundingClientRect().bottom+40"))}); light=page.evaluate("document.documentElement.dataset.themeMode")
        info["lightMode"]=light; info["jsErrors"]=errors
        # tile links resolve
        codes=[]
        for t in info.get("tiles",[]):
            r=page.request.get(base+t["href"]); codes.append(r.status)
        for c in info.get("chips",[])[:6]:
            r=page.request.get(base+c["href"]); codes.append(r.status)
        info["linkStatuses"]=codes
        res[name]=info; ctx.close()
    b.close()
d=res["desktop"]; m=res["mobile"]
res["pass"]=all([d.get("present"), len(d.get("tiles",[]))==3, d["tiles"][0]["fetchpriority"]=="high", all(t["complete"] for t in d["tiles"]), all(c==200 for c in d["linkStatuses"]), not d["overflowX"], not m["overflowX"], m.get("present"), len(m.get("tiles",[]))==3, not d["jsErrors"], not m["jsErrors"]])
print(json.dumps(res, indent=1, ensure_ascii=False))
