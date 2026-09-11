import json,sys
from playwright.sync_api import sync_playwright
base,out=sys.argv[1],sys.argv[2]; res={"base":base}
with sync_playwright() as p:
    b=p.chromium.launch(channel="chromium",args=["--headless=new"])
    for name,vp,mob in (("desktop",{"width":1440,"height":900},False),("mobile",{"width":390,"height":844},True)):
        for loc in ("en","tr"):
            ctx=b.new_context(viewport=vp,is_mobile=mob,has_touch=mob,device_scale_factor=2 if mob else 1); page=ctx.new_page(); errs=[]; page.on("pageerror",lambda e: errs.append(str(e)))
            page.goto(f"{base}/{loc}",wait_until="load",timeout=90000); page.wait_for_timeout(1500)
            for n in ("Reject","Reddet"):
                bt=page.get_by_role("button",name=n,exact=True)
                if bt.count(): bt.first.click(); break
            page.wait_for_timeout(400)
            info=page.evaluate("""()=>{const a=document.querySelector('aside[aria-labelledby="hero-showcase-heading"]'); if(!a) return {present:false};
              const tiles=[...a.querySelectorAll('a')].filter(x=>x.querySelector('img')).map(t=>{const i=t.querySelector('img'); const r=t.getBoundingClientRect(); return {href:t.getAttribute('href'),alt:i.alt.slice(0,40),fp:i.getAttribute('fetchpriority'),complete:i.complete&&i.naturalWidth>0,w:Math.round(r.width),h:Math.round(r.height)}});
              const chips=[...a.querySelectorAll('ul a')].map(x=>({text:x.textContent.trim(),href:x.getAttribute('href')}));
              const h1=document.querySelector('.hero h1').getBoundingClientRect();
              return {present:true,heading:a.querySelector('#hero-showcase-heading').textContent,viewAll:a.querySelector('a').textContent.trim(),tiles,chips,h1Width:Math.round(h1.width),h1Height:Math.round(h1.height),overflowX:document.documentElement.scrollWidth>innerWidth,heroH:Math.round(document.querySelector('.hero').getBoundingClientRect().height)}}""")
            codes=[]
            for t in info.get("tiles",[]): codes.append(page.request.get(base+t["href"]).status)
            for c in info.get("chips",[]): codes.append(page.request.get(base+c["href"].split('#')[0]).status)
            info["linkStatuses"]=codes; info["jsErrors"]=errs
            h=page.evaluate("document.querySelector('.hero').getBoundingClientRect().bottom+20")
            page.screenshot(path=f"{out}-{name}-{loc}-dark.png",clip={"x":0,"y":0,"width":vp["width"],"height":min(1900,h)})
            if not mob:
                tb=page.get_by_role("button",name="Switch to light mode")
                if tb.count(): tb.first.click(); page.wait_for_timeout(500); page.screenshot(path=f"{out}-{name}-{loc}-light.png",clip={"x":0,"y":0,"width":vp["width"],"height":min(1900,h)})
            res[f"{name}_{loc}"]=info; ctx.close()
    b.close()
ok=all(x.get("present") and len(x["tiles"])==3 and x["tiles"][0]["fp"]=="high" and all(t["complete"] for t in x["tiles"]) and all(c==200 for c in x["linkStatuses"]) and not x["overflowX"] and not x["jsErrors"] for x in res.values() if isinstance(x,dict))
res["pass"]=bool(ok); print(json.dumps(res,indent=1,ensure_ascii=False))
