const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});try{const out=[];
for(const locale of ['de','en','tr']){
 const c=await b.newContext({viewport:{width:390,height:844}});await c.addInitScript(()=>localStorage.setItem('ensotek.analytics-consent.v1',JSON.stringify({value:'denied',expires:Date.now()+86400000})));
 const p=await c.newPage(),requests=[],errors=[];let writes=0;p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{const u=new URL(r.url());if(['/api/products','/api/services'].includes(u.pathname))requests.push({path:u.pathname,query:u.search});if(r.method()==='POST')writes++;});
 await p.goto('https://ensotek.de/'+locale+'/offer');await p.waitForLoadState('networkidle');if(requests.length)throw Error('Unused list request on general form '+JSON.stringify(requests));
 const f=p.locator('main form');await f.locator('input[type=email]').fill('qa@example.invalid');
 await p.locator('#type-product').check();await p.waitForFunction(()=>document.querySelector('main form select')?.options.length>1);const productCount=await f.locator('select option').count();const product=await f.locator('select option').nth(1).getAttribute('value');await f.locator('select').selectOption(product);
 if(requests.length!==1||requests[0].path!=='/api/products'||!requests[0].query.includes('locale='+locale))throw Error('Product query contract failed');
 await p.locator('#type-service').check();await p.waitForFunction(()=>document.querySelector('main form select')?.options.length>1);const serviceCount=await f.locator('select option').count();
 if(requests.length!==2||requests[1].path!=='/api/services')throw Error('Service query contract failed');
 await p.locator('#type-product').check();await p.waitForLoadState('networkidle');if(requests.length!==2)throw Error('Cached list refetched');
 if(await f.locator('input[type=email]').inputValue()!=='qa@example.invalid')throw Error('Entered value lost');
 await p.locator('#type-general').check();if(await f.locator('select').count())throw Error('General form contains unnecessary selector');
 if(errors.length||writes)throw Error(JSON.stringify({errors,writes}));out.push({locale,initialListRequests:0,requests,productOptions:productCount,serviceOptions:serviceCount,cacheReused:true,inputPreserved:true,postRequests:writes,errors});await c.close();
}
const c=await b.newContext();const p=await c.newPage();let serviceRequests=0;p.on('request',r=>{if(new URL(r.url()).pathname==='/api/services')serviceRequests++;});await p.goto('https://ensotek.de/de/product/offene-kuehltuerme-einzelzelle-ctp-serie');await p.waitForLoadState('networkidle');const selected=await p.locator('main form select').inputValue();if(!selected||serviceRequests)throw Error('Product preselection/service gate failed');out.push({productPreselection:true,serviceRequests});await c.close();console.log(JSON.stringify(out,null,2));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
