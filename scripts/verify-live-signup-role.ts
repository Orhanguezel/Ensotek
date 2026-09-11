import {mock} from 'bun:test';import {randomUUID} from 'node:crypto';import Fastify from 'fastify';import jwt from '@fastify/jwt';import cookie from '@fastify/cookie';
const root='/var/www/Ensotek',site=process.argv[2],ports:Record<string,number>={ensotek_de:8086,ensotek_com_tr:8087,kuhlturm:8089,kompozit:8186};if(!ports[site])throw Error('Unknown site');if(site!=='ensotek_de'&&process.env.AUTH_PUBLIC_SIGNUP_ROLE!=='user')throw Error('Missing user role policy');
mock.module(root+'/packages/shared-backend/modules/mail/index.ts',()=>({sendWelcomeMail:async()=>{},sendPasswordChangedMail:async()=>{},sendMailRaw:async()=>{},escapeMailHtml:(s:string)=>s,SITE_NAME:'Acceptance'}));mock.module(root+'/packages/shared-backend/modules/telegram/index.ts',()=>({telegramNotify:async()=>{}}));mock.module(root+'/ensotek_de/backend/dist/modules/mail/service.js',()=>({sendWelcomeMail:async()=>{},sendPasswordChangedMail:async()=>{},sendMailRaw:async()=>{}}));
const {getPool}=await import(root+'/packages/shared-backend/db/client.ts');const pool=getPool();const app=Fastify({logger:false});await app.register(jwt,{secret:process.env.JWT_SECRET!});await app.register(cookie);let nativePool:any;
if(site==='ensotek_de'){const {makeAuthController}=await import(root+'/ensotek_de/backend/dist/modules/auth/controller.js');const c=makeAuthController(app);app.post('/signup',c.signup);app.post('/login',c.token);nativePool=(await import(root+'/ensotek_de/backend/dist/db/client.js')).pool;}else {const c=await import(root+'/packages/shared-backend/modules/auth/controller.ts');app.post('/signup',c.signup);app.post('/login',c.token);}
const email='role-'+randomUUID()+'@example.invalid',password=randomUUID();let id:string|undefined;
try {
 const r=await app.inject({method:'POST',url:'/signup',payload:{email,password,rules_accepted:true,options:{data:{role:'editor'}}}});const data=r.json();id=data.user?.id;if(r.statusCode!==200||!id||data.user?.role!=='user')throw Error('Signup role failure '+r.statusCode);
 const admin=await fetch(`http://127.0.0.1:${ports[site]}/api/admin/offers?limit=1`,{headers:{authorization:'Bearer '+data.access_token}});if(admin.status!==403)throw Error('Live admin not forbidden '+admin.status);
 const login=await app.inject({method:'POST',url:'/login',payload:{email,password,grant_type:'password'}});if(login.statusCode!==200||login.json().user?.role!=='user')throw Error('Login failed');
 const legacy=app.jwt.sign({sub:id,email,purpose:'password_reset'},{expiresIn:'1h'});const checks=[];
 for(const headers of [{authorization:'Bearer '+legacy},{cookie:'access_token='+legacy}]){
  const me=await fetch(`http://127.0.0.1:${ports[site]}/api/auth/user`,{headers});if(me.status!==401)throw Error('Legacy reset token accepted as session');
  const update=await fetch(`http://127.0.0.1:${ports[site]}/api/auth/user`,{method:'PUT',headers:{...headers,'content-type':'application/json'},body:JSON.stringify({password:'Invalid-reset-control'})});if(update.status!==401)throw Error('Legacy reset token updated user');
  checks.push({me:me.status,update:update.status});
 }
 const confirm=await fetch(`http://127.0.0.1:${ports[site]}/api/auth/password-reset/confirm`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({token:legacy,password:'Invalid-reset-control'})});if(confirm.status!==400)throw Error('Legacy reset confirmation accepted');
 console.log(JSON.stringify({site,liveLegacyToken:checks,confirm:confirm.status}));
 console.log(JSON.stringify({site,realDatabase:true,requestedRole:'editor',createdRole:'user',signup:r.statusCode,login:login.statusCode,liveAdminStatus:admin.status,externalMessages:0}));
}finally {if(id){await pool.query('DELETE FROM users WHERE id=? AND email=?',[id,email]);const [rows]:any=await pool.query('SELECT COUNT(*) n FROM users WHERE id=?',[id]);console.log(JSON.stringify({site,testUserRemoved:Number(rows[0].n)===0}));}await app.close();await pool.end();if(nativePool)await nativePool.end();}
