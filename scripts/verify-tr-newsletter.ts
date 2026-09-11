import { mock } from 'bun:test';
import { randomUUID,createHmac } from 'node:crypto';
import Fastify from 'fastify';
import { getPool } from '../packages/shared-backend/db/client';
const root='/var/www/Ensotek';
mock.module(root+'/packages/shared-backend/modules/telegram/helpers/telegram.notifier.ts',()=>({telegramNotify:async()=>({skipped:true})}));
const {subscribeNewsletterPublic,unsubscribeNewsletterPublic}=await import(root+'/packages/shared-backend/modules/newsletter/controller.ts');
const app=Fastify({logger:false});app.post('/subscribe',subscribeNewsletterPublic);app.post('/unsubscribe',unsubscribeNewsletterPublic);
const pool=getPool(),email='newsletter-'+randomUUID()+'@example.invalid';
try{
 const invalid=await app.inject({method:'POST',url:'/subscribe',payload:{email:'invalid'}});
 const payload={email,locale:'en',meta:{source:'checklist_test',marketing_consent:true,consent_text_version:'newsletter-20260910'}};
 const one=await app.inject({method:'POST',url:'/subscribe',payload});const two=await app.inject({method:'POST',url:'/subscribe',payload});
 const row=one.json();if(one.statusCode!==201||!row.id||two.json().id!==row.id)throw Error('Subscribe/upsert failed');
 const [rows]:any=await pool.query('SELECT id,is_verified,locale,meta FROM newsletter_subscribers WHERE email=?',[email]);
 const unsub=await app.inject({method:'POST',url:'/unsubscribe',payload:{email}});
 const [after]:any=await pool.query('SELECT unsubscribed_at FROM newsletter_subscribers WHERE email=?',[email]);
 const invalidLive=await fetch('http://127.0.0.1:8087/api/newsletter/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'invalid'})});
 console.log(JSON.stringify({site:'ensotek_com_tr',invalidStatus:invalid.statusCode,liveInvalidStatus:invalidLive.status,subscribeStatus:one.statusCode,duplicateSameId:true,rows:rows.length,locale:rows[0].locale,unverified:Number(rows[0].is_verified)===0,consentSaved:JSON.parse(rows[0].meta).marketing_consent===true,unsubscribeStatus:unsub.statusCode,unsubscribed:!!after[0].unsubscribed_at,mode:'Real DB, isolated Telegram interception; public live validation request only'}));
 if(rows.length!==1||invalidLive.status!==400||!after[0].unsubscribed_at)throw Error('Newsletter acceptance failed');
}finally{await pool.query('DELETE FROM newsletter_subscribers WHERE email=?',[email]);console.log(JSON.stringify({testRowsDeleted:true}));await app.close();await pool.end();}
