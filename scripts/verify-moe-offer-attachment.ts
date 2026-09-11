import {mock} from 'bun:test';import {randomUUID,createHmac} from 'node:crypto';import Fastify from 'fastify';
import {getPool} from '../packages/shared-backend/db/client';
import {destroyCloudinaryById} from '../packages/shared-backend/modules/storage/cloudinary';
const root='/var/www/Ensotek';if(process.env.DB_NAME!=='kompozit')throw Error('Unexpected DB');
mock.module(root+'/packages/shared-backend/modules/offer/service.ts',()=>({triggerNewOfferNotifications:async()=>({skipped:true})}));
const {createOfferPublic}=await import(root+'/packages/shared-backend/modules/offer/controller.ts');
const pool=getPool(),app=Fastify({logger:false});app.post('/offers',createOfferPublic);
const email='attachment-'+randomUUID()+'@example.invalid',name='checklist-'+randomUUID()+'.pdf';let asset:any,id:string|undefined;
try {
 const bytes=await Bun.file('/tmp/ensotek-tr-offer-acceptance.pdf').arrayBuffer();
 const form=new FormData();form.append('file',new File([bytes],name,{type:'application/pdf'}));
 const upload=await fetch('http://127.0.0.1:8186/api/storage/uploads/upload?path='+encodeURIComponent('quote-requests/'+name),{method:'POST',body:form});asset=await upload.json();if(!upload.ok||!asset.id)throw Error('Upload '+upload.status+' '+JSON.stringify(asset));
 const url=new URL(asset.url,'https://www.karbonkompozit.com.tr').href;const download=await fetch(url);const saved=await download.arrayBuffer();if(!download.ok||Buffer.compare(Buffer.from(bytes),Buffer.from(saved))!==0)throw Error('Attachment download mismatch');
 const r=await app.inject({method:'POST',url:'/offers',payload:{customer_name:'CHECKLIST TEST - REMOVE',email,locale:'tr',source:'checklist_test',subject:'Attachment acceptance',consent_terms:true,form_data:{attachments:[{id:asset.id,name,type:'application/pdf',size:bytes.byteLength,url,path:asset.path}]}}});id=r.json().id;if(r.statusCode!==201||!id)throw Error(r.body);
 const [admins]:any=await pool.query("SELECT user_id FROM user_roles WHERE role='admin' LIMIT 1");const enc=(x:any)=>Buffer.from(JSON.stringify(x)).toString('base64url');const raw=enc({alg:'HS256',typ:'JWT'})+'.'+enc({sub:admins[0].user_id,role:'admin',exp:Math.floor(Date.now()/1000)+300});const token=raw+'.'+createHmac('sha256',process.env.JWT_SECRET!).update(raw).digest('base64url');
 const admin=await fetch(`http://127.0.0.1:8186/api/admin/offers/${id}`,{headers:{authorization:'Bearer '+token}});const body=await admin.text();if(!admin.ok||!body.includes(asset.id))throw Error('Admin attachment missing');
 console.log(JSON.stringify({site:'kompozit',uploadStatus:upload.status,downloadStatus:download.status,bytesEqual:true,offerStatus:r.statusCode,adminStatus:admin.status,attachmentVisible:true,provider:asset.provider,externalEmails:0}));
}finally {
 if(id)await pool.query('DELETE FROM offers WHERE id=? AND email=?',[id,email]);
 if(asset?.id){const [rows]:any=await pool.query('SELECT provider_public_id,provider_resource_type,provider FROM storage_assets WHERE id=?',[asset.id]);if(rows[0])await destroyCloudinaryById(rows[0].provider_public_id,rows[0].provider_resource_type,rows[0].provider);await pool.query('DELETE FROM storage_assets WHERE id=?',[asset.id]);}
 console.log(JSON.stringify({testOfferRemoved:!!id,testAssetRemoved:!!asset?.id}));await app.close();await pool.end();
}
