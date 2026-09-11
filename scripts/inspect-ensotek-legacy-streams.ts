/** Read-only, restricted to the account containing the verified Ensotek property. */
import {google} from 'googleapis';
import {buildMarketingOAuthClient} from '../src/modules/marketing/google-sa';
import {pool} from '../src/db/client';
const wanted=new Set(['G-XECX77LB6M','G-YYDB7LBD6Y','G-JXG2XVVQ8C','G-7S6TW9CNRJ']);
try{
 const auth=await buildMarketingOAuthClient('ensotek','ga4');if(!auth)throw Error('Missing scoped OAuth');const api=google.analyticsadmin({version:'v1beta',auth});
 const known=(await api.properties.get({name:'properties/504406901'})).data;const account=known.account;if(!account)throw Error('Verified property has no account');
 let pageToken:string|undefined,properties=0,streams=0;const matches:any[]=[],errors:any[]=[];
 do{const r=await api.properties.list({filter:'parent:'+account,showDeleted:true,pageSize:200,pageToken});for(const p of r.data.properties||[]){properties++;let st:string|undefined;try{do{const rr=await api.properties.dataStreams.list({parent:p.name!,pageSize:200,pageToken:st});for(const s of rr.data.dataStreams||[]){streams++;if(wanted.has(s.webStreamData?.measurementId||''))matches.push({property:p.name,propertyName:p.displayName,deleted:p.deleteTime||null,stream:s.name,measurementId:s.webStreamData?.measurementId,defaultUri:s.webStreamData?.defaultUri});}st=rr.data.nextPageToken||undefined;}while(st);}catch(e:any){errors.push({property:p.name,deleted:!!p.deleteTime,status:e.response?.status||e.code||null});}}pageToken=r.data.nextPageToken||undefined;}while(pageToken);
 console.log(JSON.stringify({account,propertiesIncludingDeleted:properties,streams,matches,errors,ownershipResolved:matches.some(x=>x.measurementId==='G-XECX77LB6M')}));
}catch(e:any){console.log(JSON.stringify({status:e.response?.status||e.code||null,message:String(e.message||e).slice(0,220)}));process.exitCode=1;}finally{await pool.end();}
