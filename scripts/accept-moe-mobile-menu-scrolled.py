# Safari'nin -webkit-backdrop-filter davranisini Chromium'da taklit etmek icin unprefixed backdrop-filter zorlanir.
import json, sys
from playwright.sync_api import sync_playwright
base, shot = sys.argv[1], sys.argv[2]
def run(page, force):
    page.goto(f"{base}/tr", wait_until="load", timeout=60000); page.wait_for_timeout(1500)
    if force: page.add_style_tag(content=".header-shell-scrolled{backdrop-filter:blur(20px)}")
    for name in ("Reject","Reddet"):
        bt = page.get_by_role("button", name=name, exact=True)
        if bt.count(): bt.first.click(); break
    for _ in range(6): page.mouse.wheel(0, 300); page.wait_for_timeout(120)
    page.wait_for_timeout(800)
    page.get_by_role("button", name="Open menu", exact=True).click(); page.wait_for_timeout(900)
    r = page.evaluate("""() => { const n=document.getElementById('mobile-site-navigation'); const h=document.querySelector('header'); const r=n.getBoundingClientRect(); const links=[...n.querySelectorAll('ul a')]; const vis=links.filter(a=>{const b=a.getBoundingClientRect(); return b.height>0 && b.top>=0 && b.bottom<=innerHeight;}).length;
      return {scrollY:window.scrollY, headerBackdrop:getComputedStyle(h).backdropFilter, headerHeight:h.getBoundingClientRect().height, navInsideHeader:h.contains(n), navRect:{top:r.top,height:r.height}, vh:innerHeight, menuLinks:links.length, visibleLinks:vis, closeVisible:(()=>{const c=n.querySelector('button[aria-label="Close menu"]'); const b=c.getBoundingClientRect(); return b.bottom<=innerHeight && b.height>0})()}; }""")
    page.screenshot(path=f"{shot}-{'forced' if force else 'plain'}.png")
    page.keyboard.press("Escape"); page.wait_for_timeout(300)
    return r
with sync_playwright() as p:
    b = p.chromium.launch(channel="chromium", args=["--headless=new"]); ctx = b.new_context(viewport={"width":390,"height":844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    res = {"base": base, "plain": run(page, False), "safariEmulated": run(page, True)}
    res["pass"] = res["safariEmulated"]["visibleLinks"] == res["safariEmulated"]["menuLinks"] and res["safariEmulated"]["navRect"]["height"] >= res["safariEmulated"]["vh"] - 1
    print(json.dumps(res, indent=1)); b.close()
