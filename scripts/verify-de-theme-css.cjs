const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');const fs=require('fs');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});const results=[];try{
for(const width of [390,1440])for(const path of ['/de','/en','/tr','/de/product/offene-kuehltuerme-einzelzelle-ctp-serie','/de/contact']){
 const c=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});await c.addInitScript(()=>localStorage.setItem('ensotek.analytics-consent.v1',JSON.stringify({value:'denied',expires:Date.now()+86400000})));
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('https://ensotek.de'+path);await p.waitForLoadState('networkidle');await p.evaluate(()=>document.fonts.ready);
 const styles=await p.evaluate(()=>[...document.querySelectorAll('body,header,footer,main,h1,h2,input,select,textarea,.container,.row')].map(e=>{e.getBoundingClientRect();const s=getComputedStyle(e);return {tag:e.tagName,class:e.className,css:Object.fromEntries(['color','background-color','font-family','font-size','font-weight','line-height','display','position','padding','margin','border-width','box-sizing'].map(k=>[k,s.getPropertyValue(k)]))}}));
 const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(overflow||errors.length)throw Error(JSON.stringify({path,width,overflow,errors}));results.push({path,width,styles,overflow,errors});await c.close();
}
if(process.argv.includes('--after')){fs.writeFileSync('output/checklist-2026-09-10-theme/browser-after-debug.json',JSON.stringify(results,null,2));const before=JSON.parse(fs.readFileSync('output/checklist-2026-09-10-theme/browser-before.json'));for(let i=0;i<before.length;i++)if(JSON.stringify(before[i].styles)!==JSON.stringify(results[i].styles))throw Error('Computed style mismatch '+results[i].path+' '+results[i].width);}
console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
