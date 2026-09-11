import {mock} from 'bun:test';import Fastify from 'fastify';import jwt from '@fastify/jwt';import cookie from '@fastify/cookie';import {randomUUID} from 'node:crypto';
if(process.env.DB_NAME!=='checklist_tr_seed_20260910')throw Error('Disposable DB required');
process.env.FRONTEND_URL='https://ensotek.de';process.env.AUTH_PUBLIC_SIGNUP_ROLE='user';
const root=process.env.RESET_CANDIDATE||'/var/www/Ensotek';const shared=root+'/packages/shared-backend',native=root+'/ensotek_de/backend/dist';
const mail:any[]=[];let failMail=false;const capture=async (v:any)=>{if(failMail)throw Error('mock_delivery_failure');mail.push(v);};
mock.module(shared+'/modules/mail/index.ts',()=>({sendWelcomeMail:capture,sendPasswordChangedMail:capture,sendMailRaw:capture,escapeMailHtml:(s:string)=>s,SITE_NAME:'Acceptance'}));
mock.module(shared+'/modules/telegram/index.ts',()=>({telegramNotify:async()=>{}}));mock.module(native+'/modules/mail/service.js',()=>({sendWelcomeMail:capture,sendPasswordChangedMail:capture,sendMailRaw:capture}));
const {getPool}=await import(shared+'/db/client.ts');const pool=getPool();const {pool:nativePool}=await import(native+'/db/client.js');
const app=Fastify({logger:false});await app.register(jwt,{secret:process.env.JWT_SECRET!});await app.register(cookie);
const {registerAuth}=await import(shared+'/modules/auth/router.ts');await app.register(registerAuth,{prefix:'/shared'});
const {makeAuthController}=await import(native+'/modules/auth/controller.js');const c=makeAuthController(app);for(const [path,handler] of [['signup',c.signup],['token',c.token],['password-reset/request',c.passwordResetRequest],['password-reset/confirm',c.passwordResetConfirm]] as const)app.post('/native/auth/'+path,handler);app.get('/native/auth/user',c.me);app.get('/native/auth/status',c.status);app.put('/native/auth/user',c.update);
const {requireAuth:sa}=await import(shared+'/middleware/auth.ts');const {requireAuth:na}=await import(native+'/common/middleware/auth.js');app.get('/shared/protected',{preHandler:[sa]},async()=>({ok:true}));app.get('/native/protected',{preHandler:[na]},async()=>({ok:true}));
function expect(ok:any,message:string){if(!ok)throw Error(message);}
const checks:any[]=[];
const address=await app.listen({host:'127.0.0.1',port:0});
async function request(options:any) {
 const r=await fetch(address+options.url,{method:options.method||'GET',headers:{...(options.payload?{'content-type':'application/json'}:{}),...options.headers},body:options.payload?JSON.stringify(options.payload):undefined});
 const body=await r.text();return {statusCode:r.status,body,json:()=>JSON.parse(body),headers:Object.fromEntries(r.headers)};
}
try{
 for(const kind of ['shared','native']){
  const base='/'+kind+'/auth',email=randomUUID()+'@example.invalid',oldPassword='Initial-password-2026',newPassword='New123';
  const signup=await request({method:'POST',url:base+'/signup',payload:{email,password:oldPassword,rules_accepted:true}});expect(signup.statusCode===200,'signup control');const user=signup.json().user;
  const ordinary=await request({url:base+'/user',headers:{authorization:'Bearer '+signup.json().access_token}});expect(ordinary.statusCode===200,'ordinary access');
  mail.length=0;
  const known=await request({method:'POST',url:base+'/password-reset/request',payload:{email}});const unknown=await request({method:'POST',url:base+'/password-reset/request',payload:{email:'missing@example.invalid'}});expect(known.body===unknown.body && !known.json().token,'public token leak');expect(mail.length===1,'one reset email');
  const resetToken=decodeURIComponent(mail[0].text.match(/#token=([^\s]+)/)[1]);expect(resetToken.startsWith('reset-v2.'),'separate token');
  const legacy=app.jwt.sign({sub:user.id,email,purpose:'password_reset'},{expiresIn:'1h'});
  for(const token of [legacy,resetToken]){
   const invalid=await request({method:'POST',url:base+'/password-reset/confirm',payload:{token:token===legacy?token:token.slice(0,-2)+'AA',password:newPassword}});expect(invalid.statusCode===400,'old or altered token accepted');
   for(const headers of [{authorization:'Bearer '+token},{cookie:'access_token='+token}]){
    for(const path of [base+'/user','/'+kind+'/protected']){const r=await request({url:path,headers});expect(r.statusCode===401,'reset token authenticated '+path);}
    const r=await request({method:'PUT',url:base+'/user',headers,payload:{password:newPassword}});expect(r.statusCode===401,'reset token profile update');const status=await request({url:base+'/status',headers});expect(status.json().authenticated===false,'reset token status');
   }
  }
  const race=await Promise.all([1,2].map(()=>request({method:'POST',url:base+'/password-reset/confirm',payload:{token:resetToken,password:newPassword}})));expect(race.map(r=>r.statusCode).sort().join(',')==='200,400','concurrent token replay');
  const replay=await request({method:'POST',url:base+'/password-reset/confirm',payload:{token:resetToken,password:oldPassword}});expect(replay.statusCode===400,'sequential replay');
  const loginOld=await request({method:'POST',url:base+'/token',payload:{email,password:oldPassword,grant_type:'password'}});const loginNew=await request({method:'POST',url:base+'/token',payload:{email,password:newPassword,grant_type:'password'}});expect(loginOld.statusCode===401&&loginNew.statusCode===200,'password/login control');
  failMail=true;const failed=await request({method:'POST',url:base+'/password-reset/request',payload:{email}});failMail=false;expect(failed.body===unknown.body,'mail failure enumeration');
  checks.push({kind,publicResponseToken:false,knownUnknownEqual:true,legacyResetRejected:true,bearerCookiePurposeRejected:true,tamperRejected:true,concurrentConfirm:race.map(r=>r.statusCode).sort(),replay:replay.statusCode,oldLogin:loginOld.statusCode,newLogin:loginNew.statusCode,mailFailureGeneric:true});
 }
 const page=await request({url:'/shared/auth/password-reset'});expect(page.statusCode===200&&page.headers['content-security-policy']?.includes('sha256-')&&page.headers['referrer-policy']==='no-referrer','reset page headers');
 const {createResetToken,resetSubject,verifyResetToken,resetLink}=await import(shared+'/modules/auth/password-reset.ts');const sample={id:randomUUID(),email:'sample@example.invalid',password_hash:'sample-hash'};const expired=createResetToken(sample,Date.now()-7200000);expect(resetSubject(expired)===null,'expiry');const fresh=createResetToken(sample);expect(!verifyResetToken(fresh,{...sample,email:'changed@example.invalid'}),'email binding');expect(!verifyResetToken(fresh,{...sample,password_hash:'changed'}),'password binding');
 const oldNode=process.env.NODE_ENV;process.env.NODE_ENV='development';process.env.FRONTEND_URL='http://localhost:3000';expect(resetLink('test').startsWith('http://localhost:3000/api/auth/password-reset#'),'development reset link');process.env.NODE_ENV=oldNode;
 console.log(JSON.stringify({sixCharacterPasswordAccepted:true,developmentLink:true,checks,expiredRejected:true,emailPasswordBound:true,resetPage:page.statusCode,externalMessages:0,disposableDatabase:true}));
}finally{await app.close();await pool.end();await nativePool.end();}
