import { test } from 'node:test';
import assert from 'node:assert/strict';
const expect = (actual: any) => ({ toBe: (expected: any) => assert.equal(actual, expected), toEqual: (expected: any) => assert.deepEqual(actual, expected), toBeNull: () => assert.equal(actual, null) });
import Fastify from 'fastify';
import { registerTanitioContent, contentPath } from './tanitio';

test('bearer isolation, validation, publication filters, locale and full-content response', async () => {
 const app=Fastify(); const queries: Array<{sql:string,values:any[]}> = [];
 await registerTanitioContent(app,{site:'kompozit',apiKey:()=> 'site-only-test-key',query:async(sql,values)=>{
  queries.push({sql,values});
  if(sql.includes('COUNT'))return [{total:2}];
  return [{id:'12345678-1234-1234-1234-123456789012',title:'Published',slug:'published',locale:'en',module_key:'kompozit_blog',content:'{"html":"<p>Full body</p>"}',image_url:'/cover.png',images:['/cover.png'],created_at:'2026-09-09 10:00:00',updated_at:'2026-09-09 11:00:00'}];
 }});
 const base='/api/integrations/tanitio';const headers={authorization:'Bearer site-only-test-key'};
 expect((await app.inject(base+'/articles')).statusCode).toBe(401);
 expect((await app.inject({url:base+'/articles',headers:{authorization:'Bearer other-site-key'}})).statusCode).toBe(401);
 expect(queries.length).toBe(0);
 for(const suffix of ['?locale=xx','?limit=0','?offset=-1','?updated_since=bad','?sort=unknown','?cursor=secret','?limit=1.2'])expect((await app.inject({url:base+'/articles'+suffix,headers})).statusCode).toBe(400);
 const res=await app.inject({url:base+'/articles?locale=en&limit=1',headers});
 expect(res.statusCode).toBe(200);expect(res.json().hasMore).toBe(true);
 expect(res.json().items[0].contentHtml).toBe('<p>Full body</p>');
 expect(res.json().items[0].url).toBe('https://www.karbonkompozit.com.tr/en/blog/published');
 expect(res.json().items[0].price).toBeNull();
 expect(queries.every(q=>q.sql.includes('p.is_published=1')&&q.sql.includes('i.locale=?'))).toBe(true);
 expect(queries[0].values).toEqual(['en','kompozit_blog']);
 queries.length=0;
 await app.inject({url:base+'/products?locale=tr',headers});
 expect(queries.every(q=>q.sql.includes('p.is_active=1'))).toBe(true);
 await app.close();
});
test('disabled integration fails closed and paths use the actual site routes',async()=>{
 const app=Fastify();await registerTanitioContent(app,{site:'ensotek_de',apiKey:()=>undefined,query:async()=>{throw Error('must not query');}});
 expect((await app.inject('/api/integrations/tanitio')).statusCode).toBe(503);
 expect(contentPath('ensotek_com_tr','tr',{slug:'soğutma-kulesi'},true)).toBe('/tr/urunler/sogutma-kulesi');
 expect(contentPath('kuhlturm','de',{slug:'qualitaetsstandards',module_key:'quality'},false)).toBe('/de/about/qualitaetsstandards');
 expect(contentPath('ensotek_de','de',{slug:'teil',item_type:'sparepart'},true)).toBe('/de/sparepart/teil');
 await app.close();
});
