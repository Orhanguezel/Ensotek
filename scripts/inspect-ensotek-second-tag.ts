/** Read-only TAN03 audit. Run from Tanitio backend/scripts; no tag/account changes. */
import { google } from 'googleapis';
import { buildMarketingOAuthClient } from '../src/modules/marketing/google-sa';
import { pool } from '../src/db/client';
const parent='accounts/6330619450/containers/238844696';
const wanted='G-XECX77LB6M';
const measurementIds=(value: unknown)=>[...new Set(JSON.stringify(value).match(/G-[A-Z0-9]{6,}/g)||[])];
try {
 const auth=await buildMarketingOAuthClient('ensotek','gtm');if(!auth)throw Error('Missing scoped OAuth');
 const api=google.tagmanager({version:'v2',auth});
 const live=(await api.accounts.containers.versions.live({parent})).data;
 const summarize=(v:any)=>({version:v.containerVersionId,name:v.name,container:v.container?.publicId,tags:(v.tag||[]).filter((t:any)=>measurementIds(t).length).map((t:any)=>({id:t.tagId,name:t.name,type:t.type,paused:!!t.paused,measurementIds:measurementIds(t),firingTriggerId:t.firingTriggerId,blockingTriggerId:t.blockingTriggerId,setupTag:t.setupTag,teardownTag:t.teardownTag})),triggers:(v.trigger||[]).map((t:any)=>({id:t.triggerId,name:t.name,type:t.type})),variables:(v.variable||[]).filter((x:any)=>measurementIds(x).length).map((x:any)=>({name:x.name,type:x.type,measurementIds:measurementIds(x)}))});
 console.log(JSON.stringify({kind:'live',...summarize(live)}));
 let pageToken: string|undefined;const headers:any[]=[];
 do{const r=await api.accounts.containers.version_headers.list({parent,pageToken});headers.push(...(r.data.containerVersionHeader||[]));pageToken=r.data.nextPageToken||undefined;}while(pageToken);
 for(const h of headers.filter(h=>!h.deleted).sort((a,b)=>Number(a.containerVersionId)-Number(b.containerVersionId))){
  const v=h.containerVersionId===live.containerVersionId?live:(await api.accounts.containers.versions.get({path:parent+'/versions/'+h.containerVersionId})).data;
  const s=summarize(v);console.log(JSON.stringify({kind:'history',...s,containsWanted:measurementIds(v).includes(wanted)}));
 }
} catch(e:any){console.log(JSON.stringify({kind:'error',status:e?.response?.status||e?.code||null,message:String(e?.message||e).slice(0,220)}));process.exitCode=1;}finally{await pool.end();}
