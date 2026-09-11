import { mock } from 'bun:test';
import { createHmac, randomUUID } from 'node:crypto';
import Fastify from 'fastify';
import { getPool } from '../packages/shared-backend/db/client';
const root='/var/www/Ensotek';
const site=process.argv[2];
const ports:Record<string,number>={ensotek_de:8086,ensotek_com_tr:8087,kuhlturm:8089,kompozit:8186};
if (!ports[site]) throw Error('Unexpected site');
const locale=site==='ensotek_de'||site==='kuhlturm'?'de':'tr';
const { SITE_NAME: resolvedSiteName } = await import(root+'/packages/shared-backend/modules/mail/mail/helpers/service.ts');
const mail:any[]=[];
const capture=async (v:any)=>{mail.push(v);return {accepted:[v.to],messageId:'isolated-checklist'};};
mock.module(root+'/packages/shared-backend/modules/mail/index.ts',()=>({sendMailRaw:capture,SITE_NAME:resolvedSiteName}));
mock.module(root+'/packages/shared-backend/modules/telegram/index.ts',()=>({telegramNotify:async()=>({skipped:true})}));
mock.module(root+'/packages/shared-backend/modules/offer/service.ts',()=>({triggerNewOfferNotifications:async()=>({skipped:true})}));
if(site==='ensotek_de'){
 mock.module(root+'/ensotek_de/backend/dist/modules/mail/service.js',()=>({sendMail:capture}));
 mock.module(root+'/ensotek_de/backend/dist/modules/telegram/telegram.notifier.js',()=>({telegramNotify:async()=>({skipped:true})}));
}
const pool=getPool();
const app=Fastify({logger:false});
app.addHook('onRequest',async req=>{(req as any).locale=locale;});
const contact=site==='ensotek_de'
 ? await import(root+'/ensotek_de/backend/dist/modules/contact/controller.js')
 : await import(root+'/packages/shared-backend/modules/contact/controller.ts');
const offer=await import(root+'/packages/shared-backend/modules/offer/controller.ts');
app.post('/api/contacts',contact.createContactPublic);
app.post('/api/offers',offer.createOfferPublic);
const email='checklist-'+randomUUID()+'@example.invalid';
const created:Array<{table:string,id:string}>=[];
const checks:any[]=[];
const prefix=process.env.OFFER_TABLE_PREFIX||'';
if (!/^[a-z_]*$/.test(prefix))throw Error('Unexpected table prefix');
const table=prefix+'offers';
const [admins]:any=await pool.query("SELECT user_id FROM user_roles WHERE role='admin' LIMIT 1");
if (!admins.length)throw Error('No admin for read-only acceptance');
const enc=(v:any)=>Buffer.from(JSON.stringify(v)).toString('base64url');
const payload=enc({alg:'HS256',typ:'JWT'})+'.'+enc({sub:admins[0].user_id,role:'admin',exp:Math.floor(Date.now()/1000)+300});
if(!process.env.JWT_SECRET)throw Error('JWT secret missing');
const token=payload+'.'+createHmac('sha256',process.env.JWT_SECRET).update(payload).digest('base64url');
async function adminRead(kind:string,id:string){const r=await fetch(`http://127.0.0.1:${ports[site]}/api/admin/${kind}/${id}`,{headers:{Authorization:'Bearer '+token,'x-locale':locale}});const data:any=await r.json();return {status:r.status,idMatches:(data.data?.id||data.id)===id};}
try {
 const attribution={analytics_consent:true,landing_path:'/tr/product/checklist',utm_source:'instagram',utm_medium:'social',utm_campaign:'checklist_test'};
 const body={name:'CHECKLIST TEST - REMOVE',email,phone:'+900000000000',subject:'CHECKLIST TEST',message:'Isolated acceptance. Notifications suppressed in this process.',company:'CHECKLIST TEST',attribution};
 const invalid=await app.inject({method:'POST',url:'/api/contacts',payload:{}});checks.push({kind:'invalid_contact',status:invalid.statusCode});
 const bot=await app.inject({method:'POST',url:'/api/contacts',payload:{...body,website:'bot'}});checks.push({kind:'honeypot_contact',status:bot.statusCode,hasId:!!bot.json().id});
 const response=await app.inject({method:'POST',url:'/api/contacts',payload:body});const row=response.json();
 if(response.statusCode!==201||!row.id)throw Error('Contact create failed: '+response.body);
 created.push({table:'contact_messages',id:row.id});
 const [saved]:any=await pool.query('SELECT id,message FROM contact_messages WHERE id=?',[row.id]);
 const admin=await adminRead('contacts',row.id);
 checks.push({kind:'contact',status:response.statusCode,recordId:row.id,dbMatches:saved[0]?.id===row.id,attributionSaved:saved[0]?.message.includes('"utm_source":"instagram"'),companySaved:saved[0]?.message.includes('Firma / Company'),admin,interceptedMailCount:mail.length,adminRecipientsValid:mail.some(x=>x.to!==email&&!/noreply|no-reply/i.test(String(x.to))),customerReply:mail.some(x=>x.to===email),replySubject:mail.find(x=>x.to===email)?.subject});
 for(const consent of [false,true]){
  const r=await app.inject({method:'POST',url:'/api/offers',payload:{customer_name:'CHECKLIST TEST - REMOVE',email,phone:'+900000000000',source:'checklist_test',locale,subject:'CHECKLIST TEST',message:'Isolated acceptance, no notifications.',consent_terms:true,consent_marketing:consent,form_data:{attribution,related_type:'general'}}});const v=r.json();
  if(r.statusCode!==201||!v.id)throw Error('Offer create failed: '+r.body);
  created.push({table,id:v.id});
  const [saved]:any=await pool.query(`SELECT id,consent_terms,consent_marketing,form_data,locale FROM \`${table}\` WHERE id=?`,[v.id]);
  checks.push({kind:'offer',status:r.statusCode,recordId:v.id,marketingRequested:consent,marketingSaved:Number(saved[0]?.consent_marketing),termsSaved:Number(saved[0]?.consent_terms),localeSaved:saved[0]?.locale,attributionSaved:String(saved[0]?.form_data).includes('instagram'),admin:await adminRead('offers',v.id)});
 }
 if(checks.some(x=>x.kind==='contact'&&(!x.dbMatches||!x.attributionSaved||!x.companySaved||x.admin.status!==200||!x.admin.idMatches||!x.adminRecipientsValid||!x.customerReply)))throw Error('Contact acceptance mismatch');
 if(checks.some(x=>x.kind==='offer'&&(x.marketingSaved!==Number(x.marketingRequested)||x.termsSaved!==1||!x.attributionSaved||x.admin.status!==200||!x.admin.idMatches)))throw Error('Offer acceptance mismatch');
 console.log(JSON.stringify({site,database:process.env.DB_NAME,mode:'Isolated production controller process; real DB; mail/Telegram/offer notifications mocked',checks}));
} finally {
 for(const row of created)await pool.query(`DELETE FROM \`${row.table}\` WHERE id=? AND email=?`,[row.id,email]);
 const [remaining]:any=await pool.query('SELECT COUNT(*) n FROM contact_messages WHERE email=?',[email]);
 console.log(JSON.stringify({site,cleanupContactRows:Number(remaining[0].n),deletedTestIds:created.map(x=>x.id),offerCounterPolicy:'Monotonic counter preserved; test gaps not reused'}));
 await app.close();await pool.end();
 if(site==='ensotek_de'){const native=await import(root+'/ensotek_de/backend/dist/db/client.js');await native.pool.end();}
}
