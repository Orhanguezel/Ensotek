import {mock} from 'bun:test';import Fastify from 'fastify';
let payload:any={email:'existing-admin@example.invalid',email_verified:false};let reads=0;
const root='/var/www/Ensotek/ensotek_de/backend/dist';
mock.module('google-auth-library',()=>({OAuth2Client:class{async verifyIdToken(){return{getPayload:()=>payload};}}}));
mock.module(root+'/modules/siteSettings/service.js',()=>({getGoogleSettings:async()=>({clientId:'unit-test',clientSecret:'unit-test'})}));
mock.module(root+'/db/client.js',()=>({db:{select:()=>{reads++;return{from:()=>({where:()=>({limit:async()=>[{id:'existing',email:payload.email,email_verified:1,is_active:1}]})})};},update:()=>({set:()=>({where:async()=>{}})})}}));
mock.module(root+'/modules/auth/controller.js',()=>({issueTokens:async()=>({access:'test-access',refresh:'test-refresh'}),setAccessCookie:()=>{},setRefreshCookie:()=>{},parseAdminEmailAllowlist:()=>new Set(),ensureProfileRow:async()=>{},baseUrlFrom:()=>'',frontendRedirectDefault:()=>'/login'}));
mock.module(root+'/modules/userRoles/service.js',()=>({getPrimaryRole:async()=> 'admin'}));
const {makeGoogleAuthController}=await import(root+'/modules/auth/google.controller.js');
const app=Fastify({logger:false});const c=makeGoogleAuthController(app);app.post('/google',c.google);
try{const bad=await app.inject({method:'POST',url:'/google',payload:{id_token:'test-id-token-valid-length'}});if(bad.statusCode!==401||reads!==0)throw Error('Unverified email reached account lookup '+bad.statusCode+' '+reads);payload.email_verified=true;const good=await app.inject({method:'POST',url:'/google',payload:{id_token:'test-id-token-valid-length'}});if(good.statusCode!==200||good.json().user?.role!=='admin')throw Error('Verified existing Google login broke '+good.body);console.log(JSON.stringify({unverifiedEmail:bad.statusCode,lookupBeforeVerification:false,verifiedExistingAccount:good.statusCode,externalOAuthCalls:0}));}finally{await app.close();}
