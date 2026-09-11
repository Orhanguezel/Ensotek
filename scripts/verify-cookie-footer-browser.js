async (page) => {
 const results=[];
 const sites=['https://ensotek.de','https://www.ensotek.com.tr','https://kuhlturm.com','https://www.karbonkompozit.com.tr'];
 for(const origin of sites){
  const context=await page.context().browser().newContext({viewport:{width:390,height:844}});
  await context.route(/https:\/\/(?:www\.googletagmanager\.com|(?:region\d*\.)?google-analytics\.com|www\.google-analytics\.com)\//,route=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
  const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  try {
   const response=await p.goto(origin+'/en');
   const dialog=p.getByRole('dialog',{name:'Cookie preferences',exact:true});await dialog.waitFor();
   await dialog.getByRole('button',{name:'Reject',exact:true}).click();await dialog.waitFor({state:'hidden'});
   await p.reload();await p.locator('footer [data-consent-preferences]').waitFor();
   const rejected=await p.evaluate(()=>({saved:JSON.parse(localStorage.getItem('ensotek.analytics-consent.v1')).value,dialogs:document.querySelectorAll('[role="dialog"][aria-label="Cookie preferences"]').length,footerButtons:document.querySelectorAll('footer [data-consent-preferences]').length,fixedPreferences:[...document.querySelectorAll('button')].filter(el=>el.textContent.trim()==='Cookie preferences' && ['fixed','sticky'].includes(getComputedStyle(el).position)).length,overflow:document.documentElement.scrollWidth>innerWidth}));
   if(rejected.saved!=='denied'||rejected.dialogs!==0||rejected.fixedPreferences!==0||rejected.footerButtons!==1||rejected.overflow)throw Error('Rejected/footer acceptance failed '+origin+' '+JSON.stringify(rejected));
   await p.locator('footer [data-consent-preferences]').click();await dialog.waitFor();await dialog.getByRole('button',{name:'Allow analytics',exact:true}).click();await dialog.waitFor({state:'hidden'});
   await p.reload();await p.locator('footer [data-consent-preferences]').waitFor();
   const accepted=await p.evaluate(()=>({saved:JSON.parse(localStorage.getItem('ensotek.analytics-consent.v1')).value,dialogs:document.querySelectorAll('[role="dialog"][aria-label="Cookie preferences"]').length}));
   if(accepted.saved!=='granted'||accepted.dialogs!==0)throw Error('Accepted persistence failed');
   await p.goto(origin+'/en/contact');await p.locator('footer [data-consent-preferences]').waitFor();if(await dialog.count())throw Error('Consent repeated during navigation');
   results.push({origin,status:response.status(),firstVisitDialog:true,rejected,footerReopens:true,accepted,navigationRepeats:false,errors,analyticsRequestsIntercepted:true});
  }finally{await context.close();}
 }
 return results;
}
