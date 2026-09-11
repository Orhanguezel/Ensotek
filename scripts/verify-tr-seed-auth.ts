import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { registerAuth } from '../packages/shared-backend/modules/auth/router';
import { getPool } from '../packages/shared-backend/db/client';
import { requireAuth } from '../packages/shared-backend/middleware/auth';
import { requireAdmin } from '../packages/shared-backend/middleware/roles';
if (process.env.DB_NAME !== 'checklist_tr_seed_20260910') throw Error('Isolated DB required');
const app=Fastify({logger:false});
await app.register(cookie);await app.register(jwt,{secret:process.env.JWT_SECRET!});
await app.register(registerAuth,{prefix:'/api'});
app.get('/api/admin/acceptance',{onRequest:[requireAuth,requireAdmin]},async()=>({ok:true}));
try {
 const bad=await app.inject({method:'POST',url:'/api/auth/login',payload:{email:process.env.ADMIN_EMAIL,password:'incorrect-test-password'}});
 const login=await app.inject({method:'POST',url:'/api/auth/login',payload:{email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD}});
 const data=login.json();
 if(login.statusCode!==200||!data.access_token)throw Error('Seed login failed status '+login.statusCode);
 const admin=await app.inject({method:'GET',url:'/api/admin/acceptance',headers:{authorization:'Bearer '+data.access_token}});
 const guest=await app.inject({method:'GET',url:'/api/admin/acceptance'});
 if(bad.statusCode!==401||admin.statusCode!==200||guest.statusCode!==401)throw Error('Auth acceptance failed');
 console.log(JSON.stringify({isolatedDatabase:true,seedLogin:login.statusCode,wrongPassword:bad.statusCode,adminAccess:admin.statusCode,anonymousAdmin:guest.statusCode,role:data.user?.role,externalMessages:0}));
}finally {await app.close();await getPool().end();}
