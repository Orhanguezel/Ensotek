import { createHmac } from 'node:crypto';
import { pool } from '../ensotek_de/backend/dist/db/client.js';
import { adminMenuItemCreateSchema } from '../ensotek_de/backend/dist/modules/menuItems/validation.js';
try{
 const [admins]:any=await pool.query("SELECT user_id FROM user_roles WHERE role='admin' LIMIT 1");
 const enc=(x:any)=>Buffer.from(JSON.stringify(x)).toString('base64url'),raw=enc({alg:'HS256',typ:'JWT'})+'.'+enc({sub:admins[0].user_id,role:'admin',exp:Math.floor(Date.now()/1000)+300});const token=raw+'.'+createHmac('sha256',process.env.JWT_SECRET!).update(raw).digest('base64url');
 const results=[];
 for(const url of ['/[locale]/product/[slug]','/en/product/%5Bslug%5D']){
  const r=await fetch('http://127.0.0.1:8086/api/admin/menu_items',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({title:'CHECKLIST TEST - INVALID PLACEHOLDER',type:'custom',location:'header',locale:'de',url})});
  const body:any=await r.json();
  if(r.status===201||r.status===200){const id=body.id||body.data?.id;if(id){await pool.query('DELETE FROM menu_items_i18n WHERE menu_item_id=?',[id]);await pool.query('DELETE FROM menu_items WHERE id=?',[id]);}}
  results.push({url,status:r.status});if(r.status!==400)throw Error('Placeholder validation failed '+JSON.stringify(results));
 }
 const concreteAccepted=adminMenuItemCreateSchema.safeParse({title:'Product',type:'custom',location:'header',locale:'de',url:'/de/product/real-product'}).success;
 if(!concreteAccepted)throw Error('Valid URL rejected');console.log(JSON.stringify({results,concreteAccepted,mode:'Live invalid admin inputs, no records expected'}));
}finally{await pool.end();}
