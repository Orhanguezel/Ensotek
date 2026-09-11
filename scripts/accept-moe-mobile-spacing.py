import json,sys
from playwright.sync_api import sync_playwright
base,out=sys.argv[1],sys.argv[2]; proxy=sys.argv[3] if len(sys.argv)>3 else None
with sync_playwright() as p:
    b=p.chromium.launch(channel="chromium",args=["--headless=new"]); ctx=b.new_context(viewport={"width":390,"height":844},is_mobile=True,has_touch=True,device_scale_factor=2); page=ctx.new_page()
    if proxy:
        def pr(route):
            u=route.request.url
            if "/_next/image" in u or "/uploads/" in u: route.fulfill(response=route.fetch(url=u.replace(base,proxy)))
            else: route.continue_()
        page.route("**/*",pr)
    page.goto(f"{base}/tr",wait_until="load",timeout=90000); page.wait_for_timeout(1200)
    for n in ("Reject","Reddet"):
        bt=page.get_by_role("button",name=n,exact=True)
        if bt.count(): bt.first.click(); break
    page.wait_for_timeout(300)
    def gaps(): return page.evaluate("""()=>{const h=document.querySelector('header').getBoundingClientRect(); const e=document.querySelector('section.hero span'); const eb=e.getBoundingClientRect(); const cta=document.querySelector('section.hero .hero-btn-primary').getBoundingClientRect(); const sh=document.querySelector('aside[aria-labelledby="hero-showcase-heading"]').getBoundingClientRect(); return {headerBottom:Math.round(h.bottom), eyebrowTop:Math.round(eb.top), gapHeaderEyebrow:Math.round(eb.top-h.bottom), gapCtaShowcase:Math.round(sh.top-cta.bottom), themeMode:document.documentElement.dataset.themeMode}}""")
    dark=gaps(); page.screenshot(path=f"{out}-mobile-dark.png")
    page.get_by_role("button",name="Open menu",exact=True).click(); page.wait_for_timeout(900)
    menu=page.locator('#mobile-site-navigation')
    top=menu.evaluate("""n=>{const bar=n.querySelector('div'); const r=bar.getBoundingClientRect(); const btns=[...bar.querySelectorAll('button,a')].map(x=>({label:x.getAttribute('aria-label')||x.textContent.trim().slice(0,20), top:Math.round(x.getBoundingClientRect().top), inViewport:x.getBoundingClientRect().bottom<=innerHeight})); return {barTop:Math.round(r.top), barHeight:Math.round(r.height), controls:btns, themeInMenuTopBar: !!bar.querySelector('button[aria-label*="mode" i]'), langInMenuTopBar: !!bar.querySelector('[aria-label*="dil" i],[aria-label*="lang" i],select,a[hreflang]')}}""")
    page.screenshot(path=f"{out}-mobile-menu.png")
    tb=menu.locator('button[aria-label*="light mode" i], button[aria-label*="dark mode" i]').first
    toggled=None
    if tb.count():
        before=page.evaluate("document.documentElement.dataset.themeMode"); tb.click(); page.wait_for_timeout(500); after=page.evaluate("document.documentElement.dataset.themeMode"); toggled={"before":before,"after":after}
    page.keyboard.press("Escape"); page.wait_for_timeout(400)
    light=gaps(); page.screenshot(path=f"{out}-mobile-light.png")
    res={"base":base,"dark":dark,"menuTop":top,"toggled":toggled,"afterToggle":light}
    res["pass"]=bool(dark["gapHeaderEyebrow"]<=16 and top["themeInMenuTopBar"] and toggled and toggled["before"]!=toggled["after"])
    print(json.dumps(res,indent=1,ensure_ascii=False)); b.close()
