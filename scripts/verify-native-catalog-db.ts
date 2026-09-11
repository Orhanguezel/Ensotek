import { mock } from 'bun:test';
import { randomUUID, createHmac } from 'node:crypto';
import Fastify from 'fastify';
import { getPool } from '../packages/shared-backend/db/client';
const root='/var/www/Ensotek',site=process.argv[2];
if(!['ensotek_de','kuhlturm'].includes(site))throw Error('Native sites only');
const native=root+'/'+site+'/backend/dist';
const helper=await import(root+'/packages/shared-backend/modules/mail/mail/helpers/service.ts');
const messages:any[]=[];const capture=async(x:any)=>{messages.push(x);return {accepted:[x.to]};};
mock.module(root+'/packages/shared-backend/modules/mail/index.ts',()=>({...helper,sendMailRaw:capture}));
mock.module(root+'/packages/shared-backend/modules/mail/service.ts',()=>({sendMail:capture}));
mock.module(native+'/modules/mail/service.js',()=>({sendMail:capture}));
mock.module(root+'/packages/shared-backend/modules/telegram/index.ts',()=>({telegramNotify:async()=>({skipped:true})}));
mock.module(native+'/modules/telegram/telegram.notifier.js',()=>({telegramNotify:async()=>({skipped:true})}));
const controller=await import(native+'/modules/catalog/controller.js');
const service=await import(native+'/modules/catalog/service.js');
const pool=getPool();const app=Fastify({logger:false});
app.post('/api/catalog-requests',controller.createCatalogRequestPublic);
if(site==='ensotek_de')app.get('/api/catalog-requests/verify',controller.verifyCatalogRequestPublic);
const [admins]:any=await pool.query("SELECT user_id FROM user_roles WHERE role='admin' LIMIT 1");
const enc=(x:any)=>Buffer.from(JSON.stringify(x)).toString('base64url');
const body=enc({alg:'HS256',typ:'JWT'})+'.'+enc({sub:admins[0].user_id,role:'admin',exp:Math.floor(Date.now()/1000)+300});
const token=body+'.'+createHmac('sha256',process.env.JWT_SECRET!).update(body).digest('base64url');
const email='catalog-'+randomUUID()+'@example.invalid',created:string[]=[],checks:any[]=[];
try{
 for(const locale of ['de','en']){
  const before=messages.length;
  const r=await app.inject({method:'POST',url:'/api/catalog-requests',headers:{host:'untrusted.invalid','x-forwarded-host':'untrusted.invalid'},payload:{customer_name:'CHECKLIST TEST - REMOVE',company_name:'CHECKLIST TEST',email,locale,consent_terms:true,consent_marketing:false}});
  const row=r.json();if(r.statusCode!==201||!row.id)throw Error('Create failed '+r.body);created.push(row.id);
  let verify:any={mode:'admin-driven delivery'};
  if(site==='ensotek_de'){
   const mail=messages.slice(before).find(x=>x.to===email&&x.text?.includes('/verify?'));
   if(!mail)throw Error('Verification mail missing');
   const url=new URL(mail.text.match(/https?:\/\/[^\s]+/)[0]);
   if(url.origin!==new URL(process.env.FRONTEND_URL!).origin)throw Error('Untrusted host reflected');
   const concurrent=await Promise.all([0,1].map(()=>app.inject({url:url.pathname+url.search})));
   if(concurrent.map(x=>x.statusCode).sort().join(',')!=='200,410')throw Error('Concurrent token claim failed');
   const response=concurrent.find(x=>x.statusCode===200)!;const count=messages.length;
   const replay=await app.inject({url:url.pathname+url.search});
   verify={verificationStatus:response.statusCode,concurrentStatuses:concurrent.map(x=>x.statusCode),replay:replay.statusCode,replayNoMail:messages.length===count,replyLanguage:response.body.includes(`lang="${locale}"`),brand:response.body.includes(helper.SITE_NAME)};
   if(response.statusCode!==200||replay.statusCode!==410||!verify.replayNoMail||!verify.replyLanguage||!verify.brand)throw Error(JSON.stringify(verify));
  }else if(!await service.sendCatalogToCustomer({...row,locale}))throw Error('Admin-driven send failed');
  const [saved]:any=await pool.query('SELECT id,status,email_sent_at,consent_marketing FROM catalog_requests WHERE id=?',[row.id]);
  const admin=await fetch(`http://127.0.0.1:${site==='ensotek_de'?8086:8089}/api/admin/catalog-requests/${row.id}`,{headers:{Authorization:'Bearer '+token}});const data:any=await admin.json();
  const customer=messages.slice(before).find(x=>x.to===email&&x.attachments?.length);
  const pdf=customer?.attachments?.[0]?.path;
  const pdfResponse=pdf?await fetch(pdf,{headers:{Range:'bytes=0-7'}}):null;
  const check={locale,status:r.statusCode,...verify,dbSent:saved[0]?.status==='sent'&&!!saved[0]?.email_sent_at,marketing:Number(saved[0]?.consent_marketing),adminStatus:admin.status,adminMatches:(data.id||data.data?.id)===row.id,pdfUrl:pdf,pdfStatus:pdfResponse?.status,adminMail:messages.slice(before).some(x=>x.to!==email&&!/noreply/i.test(String(x.to))),subjects:messages.slice(before).map(x=>x.subject)};
  await pdfResponse?.body?.cancel();checks.push(check);
  if(!check.dbSent||!customer.subject.includes(helper.SITE_NAME)||admin.status!==200||!check.adminMatches||!pdfResponse?.ok||!check.adminMail)throw Error('Acceptance failed '+JSON.stringify(check));
 }
 console.log(JSON.stringify({site,mode:'Real DB and live admin reads, isolated mail/Telegram interception, no external messages',checks}));
}finally{
 for(const id of created)await pool.query('DELETE FROM catalog_requests WHERE id=? AND email=?',[id,email]);
 await pool.query('DELETE FROM notifications WHERE message LIKE ?',['%'+email+'%']);
 const [rows]:any=await pool.query('SELECT COUNT(*) n FROM catalog_requests WHERE email=?',[email]);
 console.log(JSON.stringify({site,remainingTestRows:Number(rows[0].n),deletedTestIds:created}));
 await app.close();await pool.end();const nativeDb=await import(native+'/db/client.js');await nativeDb.pool.end();
}
