import { mock } from 'bun:test';
import { randomUUID,createHmac } from 'node:crypto';
import Fastify from 'fastify';
import { getPool } from '../packages/shared-backend/db/client';
const root='/var/www/Ensotek';
mock.module(root+'/packages/shared-backend/modules/offer/service.ts',()=>({triggerNewOfferNotifications:async()=>({skipped:true})}));
const {createOfferPublic}=await import(root+'/packages/shared-backend/modules/offer/controller.ts');
const pool=getPool(),email='pdf-'+randomUUID()+'@example.invalid';
const app=Fastify({logger:false});app.post('/offers',createOfferPublic);
const prefix=process.env.OFFER_TABLE_PREFIX||'';if(!/^[a-z_]*$/.test(prefix))throw Error('Bad prefix');
const [admins]:any=await pool.query("SELECT user_id FROM user_roles WHERE role='admin' LIMIT 1");
const enc=(x:any)=>Buffer.from(JSON.stringify(x)).toString('base64url');const raw=enc({alg:'HS256',typ:'JWT'})+'.'+enc({sub:admins[0].user_id,role:'admin',exp:Math.floor(Date.now()/1000)+300});const token=raw+'.'+createHmac('sha256',process.env.JWT_SECRET!).update(raw).digest('base64url');
let id:string|undefined;
try{
 const r=await app.inject({method:'POST',url:'/offers',payload:{customer_name:'CHECKLIST TEST - REMOVE',email,locale:'en',source:'checklist_test',subject:'PDF acceptance',message:'Isolated test. Do not send.',consent_terms:true,consent_marketing:false}});const row=r.json();id=row.id;if(r.statusCode!==201||!id)throw Error(r.body);
 const headers={Authorization:'Bearer '+token};
 const generated=await fetch(`http://127.0.0.1:8087/api/admin/offers/${id}/pdf`,{method:'POST',headers});const data:any=await generated.json();const pdfUrl=data.pdf_url||data.data?.pdf_url;
 if(!generated.ok||!pdfUrl)throw Error(JSON.stringify({status:generated.status,data}));
 const pdf=await fetch(new URL(pdfUrl, process.env.FRONTEND_URL!));const bytes=Buffer.from(await pdf.arrayBuffer());if(!pdf.ok||bytes.subarray(0,5).toString()!=='%PDF-')throw Error('Not a PDF: '+pdfUrl);
 await Bun.write('/tmp/ensotek-tr-offer-acceptance.pdf',bytes);
 const list=await fetch('http://127.0.0.1:8087/api/admin/offers?limit=100&q='+encodeURIComponent(email),{headers});const text=await list.text();
 console.log(JSON.stringify({site:'ensotek_com_tr',recordId:id,created:201,pdfStatus:generated.status,downloadStatus:pdf.status,pdfSignature:true,pdfBytes:bytes.length,pdfUrl,assetId:data.pdf_asset_id||data.data?.pdf_asset_id,listStatus:list.status,listContainsRecord:text.includes(id),mode:'Real admin PDF generation, no email endpoint; isolated test offer notifications suppressed'}));
}finally{
 if(id)await pool.query(`DELETE FROM \`${prefix}offers\` WHERE id=? AND email=?`,[id,email]);
 console.log(JSON.stringify({testRowDeleted:!!id,artifact:'/tmp/ensotek-tr-offer-acceptance.pdf'}));await app.close();await pool.end();
}
