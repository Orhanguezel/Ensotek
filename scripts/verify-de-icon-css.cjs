// Run with PLAYWRIGHT_MODULE pointing to the installed playwright-core package.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const after=process.argv.includes('--after'),results=[];
 try{
  for(const path of ['/de','/en','/tr','/de/product/offene-kuehltuerme-einzelzelle-ctp-serie','/de/contact']){
   const context=await browser.newContext({viewport:{width:390,height:844}});
   await context.addInitScript(()=>localStorage.setItem('ensotek.analytics-consent.v1',JSON.stringify({value:'denied',expires:Date.now()+86400000})));
   const p=await context.newPage(),errors=[],styles=[];
   p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(r.url().includes('fontawesome-')&&r.url().endsWith('.css'))styles.push(r.url());});
   await p.goto('https://ensotek.de'+path);await p.locator('footer [data-consent-preferences]').waitFor();
   await p.waitForFunction(()=>[...document.styleSheets].some(s=>s.href?.includes('fontawesome-')));
   await p.evaluate(()=>document.fonts.ready);
   const icons=await p.evaluate(()=>[...document.querySelectorAll('i[class*="fa"],span[class*="fa-"]')].map(e=>({class:e.className,content:getComputedStyle(e,'::before').content,family:getComputedStyle(e,'::before').fontFamily})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))));
   const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   if(errors.length||overflow||!icons.length)throw Error(JSON.stringify({path,errors,overflow}));
   if(after&&styles.some(s=>s.includes('subset-20260910')))throw Error('Unexpected full CSS on '+path);
   results.push({path,icons,styles:[...styles],overflow,errors});
   if(after&&path.includes('/product/')){
    const loaded=p.waitForResponse(r=>r.url().includes('fontawesome-pro.subset-20260910.css')&&r.status()===200);
    await p.evaluate(()=>{const i=document.createElement('i');i.id='cms-icon-probe';i.className='fas fa-fish';document.body.appendChild(i);});
    await loaded;await p.waitForFunction(()=>getComputedStyle(document.querySelector('#cms-icon-probe'),'::before').content.includes('\uf578'));
    results.push({cmsDynamicFallback:true,glyph:'f578',fallbackRequests:styles.filter(s=>s.includes('subset-20260910')).length});
   }
   await context.close();
  }
  if(after){const before=JSON.parse(fs.readFileSync('output/checklist-2026-09-10-icons/browser-before.json'));for(const row of results.filter(r=>r.path)){if(JSON.stringify(row.icons)!==JSON.stringify(before.find(r=>r.path===row.path).icons))throw Error('Icon styles changed '+row.path);}}
  console.log(JSON.stringify(results,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
