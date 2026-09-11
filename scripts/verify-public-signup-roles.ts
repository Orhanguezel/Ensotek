import {mock} from 'bun:test';import Fastify from 'fastify';import jwt from '@fastify/jwt';import cookie from '@fastify/cookie';
if(process.env.DB_NAME!=='checklist_tr_seed_20260910')throw Error('Isolated DB required');
process.env.AUTH_PUBLIC_SIGNUP_ROLE='user';process.env.AUTH_ADMIN_EMAILS='shared-allowlisted@example.invalid,native-allowlisted@example.invalid';
const root='/var/www/Ensotek';const sent:any[]=[];const capture=async(v:any)=>{sent.push(v);return {accepted:[]};};
mock.module(root+'/packages/shared-backend/modules/mail/index.ts',()=>({sendWelcomeMail:capture,sendPasswordChangedMail:capture,sendMailRaw:capture,escapeMailHtml:(s:string)=>s,SITE_NAME:'Acceptance'}));
mock.module(root+'/packages/shared-backend/modules/telegram/index.ts',()=>({telegramNotify:async()=>({skipped:true})}));
mock.module(root+'/ensotek_de/backend/dist/modules/mail/service.js',()=>({sendWelcomeMail:capture,sendPasswordChangedMail:capture,sendMailRaw:capture}));
const {registerAuth}=await import(root+'/packages/shared-backend/modules/auth/router.ts');
const {getPool}=await import(root+'/packages/shared-backend/db/client.ts');
const {requireAuth}=await import(root+'/packages/shared-backend/middleware/auth.ts');const {requireAdmin}=await import(root+'/packages/shared-backend/middleware/roles.ts');
const {makeAuthController}=await import(root+'/ensotek_de/backend/dist/modules/auth/controller.js');
const {pool:nativePool}=await import(root+'/ensotek_de/backend/dist/db/client.js');
const app=Fastify({logger:false});await app.register(cookie);await app.register(jwt,{secret:process.env.JWT_SECRET!});await app.register(registerAuth,{prefix:'/api'});
const native=makeAuthController(app);app.post('/native/signup',native.signup);app.post('/native/login',native.token);app.get('/api/admin/acceptance',{onRequest:[requireAuth,requireAdmin]},async()=>({ok:true}));
const results=[];
try {
 for(const [url,email,role] of [['/api/auth/signup','shared-allowlisted@example.invalid',null],['/api/auth/register','shared-editor@example.invalid','editor'],['/native/signup','native-allowlisted@example.invalid',null]] as const){
  const password='isolated-password-20260910';const payload={email,password,rules_accepted:true,...(role?{options:{data:{role}}}:{})};
  const r=await app.inject({method:'POST',url,payload});const data=r.json();if(r.statusCode!==200||data.user?.role!=='user'||!data.access_token)throw Error('Signup failed '+url+' '+r.body);
  const [dbRows]:any=await getPool().query('SELECT role FROM user_roles WHERE user_id=?',[data.user.id]);if(dbRows.length!==1||dbRows[0].role!=='user')throw Error('DB role mismatch');
  const admin=await app.inject({method:'GET',url:'/api/admin/acceptance',headers:{authorization:'Bearer '+data.access_token}});if(admin.statusCode!==403)throw Error('Privilege escalation remains');
  const login=await app.inject({method:'POST',url:url.startsWith('/native')?'/native/login':'/api/auth/login',payload:{email,password,grant_type:"password"}});if(login.statusCode!==200||login.json().user?.role!=='user')throw Error('Login role changed '+JSON.stringify({url,status:login.statusCode,role:login.json().user?.role,error:login.json().error}));
  results.push({route:url,allowlisted:email.includes('allowlisted'),requestedRole:role,signup:r.statusCode,role:data.user.role,admin:admin.statusCode,login:login.statusCode});
 }
 console.log(JSON.stringify({isolatedDatabase:true,checks:results,externalMessages:0,notificationsCaptured:sent.length}));
}finally {await app.close();await getPool().end();await nativePool.end();}
