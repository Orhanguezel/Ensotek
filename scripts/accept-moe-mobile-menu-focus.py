import json, sys
from playwright.sync_api import sync_playwright
base=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch(channel="chromium", args=["--headless=new"]); ctx=b.new_context(viewport={"width":390,"height":844}, is_mobile=True, has_touch=True); page=ctx.new_page()
    page.goto(f"{base}/tr", wait_until="load", timeout=60000); page.wait_for_timeout(1200)
    for name in ("Reject","Reddet"):
        bt=page.get_by_role("button", name=name, exact=True)
        if bt.count(): bt.first.click(); break
    for _ in range(6): page.mouse.wheel(0,300); page.wait_for_timeout(100)
    page.wait_for_timeout(600)
    opener=page.get_by_role("button", name="Open menu", exact=True); opener.click(); page.wait_for_timeout(900)
    menu=page.locator('#mobile-site-navigation')
    opened=menu.evaluate("n=>({inert:n.inert, ariaHidden:n.getAttribute('aria-hidden'), focusInside:n.contains(document.activeElement), locked:document.body.style.overflow==='hidden', expanded:document.querySelector('[aria-controls=\"mobile-site-navigation\"]').getAttribute('aria-expanded')})")
    menu.locator('a[href],button:not([disabled])').last.focus(); page.keyboard.press('Tab')
    wrap=menu.evaluate("n=>n.contains(document.activeElement)")
    # link click closes menu and navigates
    page.keyboard.press('Escape'); page.wait_for_timeout(400)
    closed=menu.evaluate("n=>({inert:n.inert, ariaHidden:n.getAttribute('aria-hidden'), focusReturned:document.activeElement?.getAttribute('aria-controls')===n.id, unlocked:document.body.style.overflow!=='hidden', scrollKept:window.scrollY>1000})")
    opener.click(); page.wait_for_timeout(900)
    first=menu.locator('ul a').first; href=first.get_attribute('href'); first.click(); page.wait_for_timeout(1500)
    nav={"href":href, "url":page.url, "menuClosedAfterNav":menu.evaluate("n=>n.inert")}
    res={"opened":opened,"tabStaysInside":wrap,"closed":closed,"linkNavigation":nav}
    res["pass"]=all([opened["focusInside"],opened["locked"],not opened["inert"],wrap,closed["inert"],closed["focusReturned"],closed["unlocked"],closed["scrollKept"],nav["menuClosedAfterNav"], href.split('/')[-1] in page.url])
    print(json.dumps(res,indent=1)); b.close()
