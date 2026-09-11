import { mock } from 'bun:test';
import { randomUUID, createHmac } from 'node:crypto';
import Fastify from 'fastify';
import { getPool } from '../packages/shared-backend/db/client';
const root='/var/www/Ensotek';const site=process.argv[2];
const ports:Record<string,number>={ensotek_de:8086,ensotek_com_tr:8087,kuhlturm:8089,kompozit:8186};
if(site!=='ensotek_com_tr')throw Error('This acceptance targets the TR shared catalog module only; DE/K use native catalog_requests, MOE has no catalog request module.');
const helpers=await import(root+'/packages/shared-backend/modules/mail/mail/helpers/service.ts');
const mail:any[]=[];
mock.module(root+'/packages/shared-backend/modules/mail/index.ts',()=>({...helpers,sendMailRaw:async (x:any)=>{mail.push(x);return {accepted:[x.to],messageId:'isolated-catalog-test'};}}));
mock.module(root+'/packages/shared-backend/modules/telegram/index.ts',()=>({telegramNotify:async()=>({skipped:true})}));
const {createCatalogRequestPublic,verifyCatalogRequestPublic}=await import(root+'/packages/shared-backend/modules/catalogRequests/controller.ts');
const app=Fastify({logger:false});app.post('/api/catalog-requests',createCatalogRequestPublic);app.get('/api/catalog-requests/verify',verifyCatalogRequestPublic);
const pool=getPool();const created:string[]=[];const checks:any[]=[];const email='catalog-'+randomUUID()+'@example.invalid';
const [admins]:any=await pool.query("SELECT user_id FROM user_roles WHERE role='admin' LIMIT 1");
const enc=(x:any)=>Buffer.from(JSON.stringify(x)).toString('base64url');
const body=enc({alg:'HS256',typ:'JWT'})+'.'+enc({sub:admins[0].user_id,role:'admin',exp:Math.floor(Date.now()/1000)+300});
const jwt=body+'.'+createHmac('sha256',process.env.JWT_SECRET!).update(body).digest('base64url');
try{
 for(const locale of [site==='kuhlturm'||site==='ensotek_de'?'de':'tr','en']){
  const before=mail.length;
  const r=await app.inject({method:'POST',url:'/api/catalog-requests',headers:{host:'untrusted.invalid','x-forwarded-host':'untrusted.invalid'},payload:{customer_name:'CHECKLIST TEST - REMOVE',email,phone:'+900000000000',company_name:'CHECKLIST TEST',message:'Isolated catalog acceptance. No real delivery.',locale,consent_terms:true,consent_marketing:false}});
  const value=r.json();const row=value.data||value;
  if(r.statusCode!==201||!row.id)throw Error('Catalog create failed '+r.body);
  created.push(row.id);
  const verification=mail.slice(before).find(x=>x.to===email&&x.text?.includes('/api/catalog-requests/verify?'));
  if(!verification)throw Error('No intercepted verification mail');
  const url=new URL(verification.text.match(/https?:\/\/[^\s]+/)[0]);
  if(url.hostname!==new URL(process.env.FRONTEND_URL!).hostname)throw Error('Untrusted verification origin');
  const concurrent=await Promise.all([0,1].map(()=>app.inject({method:'GET',url:url.pathname+url.search,headers:{host:url.host}})));
  if(concurrent.map(x=>x.statusCode).sort().join(',')!=='200,410')throw Error('Concurrent token claim failed');
  const verified=concurrent.find(x=>x.statusCode===200)!;
  const sentCount=mail.length;
  const replay=await app.inject({method:'GET',url:url.pathname+url.search,headers:{host:url.host}});
  const [saved]:any=await pool.query('SELECT id,status,locale,catalog_url,consent_marketing,email_verified_at,email_sent_at,verification_token_hash FROM lead_catalog_downloads WHERE id=?',[row.id]);
  const admin=await fetch(`http://127.0.0.1:${ports[site]}/api/admin/catalog-requests/${row.id}`,{headers:{Authorization:'Bearer '+jwt}});
  const adminData:any=await admin.json();
  const check={locale,status:r.statusCode,recordId:row.id,verificationStatus:verified.statusCode,concurrentStatuses:concurrent.map(x=>x.statusCode),replayStatus:replay.statusCode,replaySentMail:mail.length!==sentCount,dbStatus:saved[0]?.status,pdfUrl:saved[0]?.catalog_url,verified:!!saved[0]?.email_verified_at,sent:!!saved[0]?.email_sent_at,tokenConsumed:saved[0]?.verification_token_hash===null,marketing:Number(saved[0]?.consent_marketing),adminStatus:admin.status,adminIdMatches:(adminData.data?.id||adminData.id)===row.id,verificationOrigin:url.origin,replyLanguage:verified.body.includes(`lang="${locale}"`),replyBrand:verified.body.includes(helpers.SITE_NAME),mailSubjects:mail.slice(before).map(x=>x.subject)};
  checks.push(check);
  if(verified.statusCode!==200||replay.statusCode!==410||check.replaySentMail||!check.verified||!check.sent||!check.tokenConsumed||!check.replyLanguage||!check.replyBrand||admin.status!==200||!check.adminIdMatches)throw Error('Catalog acceptance mismatch '+JSON.stringify(check));
 }
 console.log(JSON.stringify({site,siteName:helpers.SITE_NAME,mode:'Real DB and admin reads; mail and Telegram mocked in isolated process',checks}));
}finally{
 for(const id of created)await pool.query('DELETE FROM lead_catalog_downloads WHERE id=? AND email=?',[id,email]);
 const [left]:any=await pool.query('SELECT COUNT(*) n FROM lead_catalog_downloads WHERE email=?',[email]);
 console.log(JSON.stringify({site,remainingTestRows:Number(left[0].n),deletedTestIds:created}));
 await app.close();await pool.end();
}
