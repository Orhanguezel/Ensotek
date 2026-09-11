async (page) => {
 const results=[];
 for(const profile of [{name:'mobile',width:390,motion:'no-preference',animate:false},{name:'desktop',width:1440,motion:'no-preference',animate:true},{name:'reduced-motion',width:1440,motion:'reduce',animate:false}]){
  const context=await page.context().browser().newContext({viewport:{width:profile.width,height:844},reducedMotion:profile.motion});
  await context.addInitScript(()=>localStorage.setItem('ensotek.analytics-consent.v1',JSON.stringify({value:'denied',expires:Date.now()+86400000})));
  const p=await context.newPage();const errors=[],settings=[],chunks=[];
  p.on('pageerror',e=>errors.push(e.message));
  p.on('request',r=>{const u=new URL(r.url());if(u.pathname==='/api/site_settings')settings.push(u.search);if(u.pathname.endsWith('.js'))chunks.push(u.pathname);});
  try{
   const data=p.waitForResponse(r=>r.url().includes('key_in=')&&r.url().includes('/site_settings'));
   await p.goto('https://ensotek.de/de/product/offene-kuehltuerme-einzelzelle-ctp-serie');const response=await data;const values=await response.json();
   await p.locator('footer [data-consent-preferences]').waitFor();await p.waitForFunction(()=>document.readyState==='complete');
   if(profile.animate)await p.waitForFunction(()=>document.body.hasAttribute('data-aos-duration'));
   await p.waitForFunction(()=>[...document.querySelectorAll('header img')].some(i=>i.complete&&i.naturalWidth>0));
   const ui=await p.evaluate(()=>({h1:document.querySelector('h1')?.textContent?.trim(),overflow:document.documentElement.scrollWidth>innerWidth,animationInitialized:document.body.hasAttribute('data-aos-duration'),footerPreferences:document.querySelectorAll('footer [data-consent-preferences]').length,logos:[...document.querySelectorAll('header img')].filter(i=>i.complete&&i.naturalWidth>0).length}));
   if(values.length!==7||settings.some(s=>!s.includes('key_in='))||ui.overflow||ui.animationInitialized!==profile.animate||!ui.h1||!ui.logos||errors.length)throw Error(JSON.stringify({profile,ui,settings,errors}));
   results.push({profile:profile.name,...ui,settingsRequests:settings,layoutKeys:values.length,layoutBytes:(await response.body()).length,errors,chunks});
  }finally{await context.close();}
 }
 return results;
}
