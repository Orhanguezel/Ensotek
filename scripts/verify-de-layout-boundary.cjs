const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const results=[];
  for(const width of [390,1440]){
   const context=await browser.newContext({viewport:{width,height:844}});
   await context.addInitScript(()=>localStorage.setItem('ensotek.analytics-consent.v1',JSON.stringify({value:'denied',expires:Date.now()+86400000})));
   const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.goto('https://ensotek.de/de/product/offene-kuehltuerme-einzelzelle-ctp-serie');
   await p.waitForFunction(()=>[...document.querySelectorAll('header img')].some(i=>i.complete&&i.naturalWidth>0));
   if(width===390){
    const menu=p.getByRole('button',{name:'Toggle Sidebar',exact:true});await menu.filter({visible:true}).first().click();
    await p.locator('.offcanvas__info.info-open').waitFor();
    const contact=p.locator('.offcanvas__info a[href="/de/contact"]').first();await contact.click();await p.waitForURL('**/de/contact');
    await p.waitForFunction(()=>!document.querySelector('.offcanvas__info.info-open'));
   }
   await p.locator('footer [data-consent-preferences]').click();await p.getByRole('dialog').waitFor();await p.getByRole('dialog').getByRole('button').first().click();
   results.push({width,menuNavigation:width===390,footerPreferences:true,errors:[...errors]});
   for(const locale of ['de','en','tr']){
    const response=await p.goto('https://ensotek.de/'+locale+'/product/checklist-does-not-exist-20260910');
    await p.getByRole('heading',{name:'404',exact:true}).waitFor();
    const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    const noindex=await p.locator('meta[name="robots"]').evaluateAll(es=>es.some(e=>e.content.includes('noindex')));
    if(overflow||!noindex||errors.length)throw Error(JSON.stringify({locale,width,overflow,noindex,errors}));
    results.push({locale,width,status:response.status(),notFoundHeading:true,noindex,overflow,errors:[...errors]});
   }
   await context.close();
  }
  console.log(JSON.stringify(results,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
