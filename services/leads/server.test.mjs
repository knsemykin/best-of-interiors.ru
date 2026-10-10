import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {randomUUID} from 'node:crypto';
import {validate,letter,createHandler} from './server.mjs';
const sample=()=>({requestId:randomUUID(),name:'Тест сайта',phone:'+70000000000',email:'test@example.com',studio:'MSK006',page:'/ratings/dizayn-interera/moskva/',consent:true,transferConsent:true,comment:'Тестовая заявка'});
test('validates consent, city and fields; preserves complete brief',()=>{
 assert.equal(validate(sample()).studioName,'Alina Salomatina Interiors');
 for(const change of [{transferConsent:false},{consent:false},{phone:'abc'},{email:'bad\r\nBcc: a@b.ru'},{studio:'VRN004'},{page:'https://evil.test'},{comment:'x'.repeat(5001)}])assert.throws(()=>validate({...sample(),...change}));
 const d=validate({...sample(),studio:'brief',area:'85',location:'Москва',brief:'Подробное описание задачи для проверки отправки',audience:'selected',priceSegment:'any',selected:['MSK006'],property:'Квартира',budget:'3–7 млн ₽'});
 assert.match(letter(d,'test'),/85/);assert.match(letter(d,'test'),/Подробное описание/);assert.match(letter(d,'test'),/Alina Salomatina/);
});
async function fixture(t,send,options){const server=http.createServer(createHandler(send,options));await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>server.close());const url=`http://127.0.0.1:${server.address().port}/leads`;return(data,origin='https://best-of-interiors.ru')=>fetch(url,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(data)});}
test('one email for double click, reject foreign origin and honeypot',async t=>{
 let sent=0;const post=await fixture(t,async()=>{sent++;});const d=sample();
 assert.equal((await post(d,'https://evil.test')).status,403);
 assert.equal((await post({...d,website:'spam'})).status,400);
 const a=await(await post(d)).json(),b=await(await post(d)).json();assert.equal(a.id,b.id);assert.equal(sent,1);
 assert.equal((await post({...d,name:'Другой'})).status,409);
});
test('SMTP failure is never reported as success and can retry',async t=>{let fail=true;const post=await fixture(t,async()=>{if(fail)throw Error('password must not leak');});const d=sample();const r=await post(d);assert.equal(r.status,502);assert.doesNotMatch(await r.text(),/password/);fail=false;assert.equal((await post(d)).status,200);});
test('rate limit prevents excess mail',async t=>{const post=await fixture(t,async()=>{},{maxPerWindow:1});assert.equal((await post(sample())).status,200);assert.equal((await post(sample())).status,429);});

test('Yandex adapter handles preflight, base64 body and trusted source IP',async()=>{
 const {makeAdapter}=await import('./yandex.cjs');let sent=0;const handler=makeAdapter(createHandler(async()=>{sent++;}));
 const headers={Origin:'https://best-of-interiors.ru','Content-Type':'application/json'};
 assert.equal((await handler({headers,httpMethod:'OPTIONS'})).statusCode,204);
 const result=await handler({headers,httpMethod:'POST',isBase64Encoded:true,body:Buffer.from(JSON.stringify(sample())).toString('base64'),requestContext:{identity:{sourceIp:'127.0.0.1'}}});
 assert.equal(result.statusCode,200);assert.equal(sent,1);assert.equal(result.headers['Access-Control-Allow-Origin'],headers.Origin);
});

test('editorial selection records segment and never forwards stale selected studios',()=>{
 const brief={...sample(),studio:'brief',area:'85',location:'Москва',brief:'Нужен проект квартиры с сопровождением',audience:'editorial',priceSegment:'premium',selected:['MSK006']};
 const d=validate(brief);assert.deepEqual(d.selected,[]);assert.match(letter(d,'test'),/Премиум/);assert.match(letter(d,'test'),/Согласие на передачу/);
 assert.throws(()=>validate({...brief,priceSegment:'invalid'}));
 assert.throws(()=>validate({...brief,audience:'selected',selected:[]}));
 assert.deepEqual(validate({...sample(),selected:[]}).selected,['MSK006']);
});

test('editorial requests require representative details but not lead transfer consent',()=>{
 for(const kind of ['correction','cooperation']){const input={...sample(),kind,company:'Тестовая студия',role:'Руководитель',comment:'Просим обновить информацию о нашей студии',transferConsent:false};const d=validate(input);assert.match(letter(d,'test'),/Руководитель/);assert.throws(()=>validate({...input,email:''}));assert.throws(()=>validate({...input,consent:false}));}
 assert.throws(()=>validate({...sample(),kind:'unknown'}));
 assert.throws(()=>validate({...sample(),kind:'correction',studio:'brief',company:'Студия',role:'Директор'}));
});
test('new catalogs accept their own companies and reject cross-segment recipients',async()=>{
 const catalog=(await import('./studios.json',{with:{type:'json'}})).default;
 for(const [key,path] of [['yekaterinburg','/ratings/dizayn-interera/yekaterinburg/'],['sankt-peterburg','/ratings/dizayn-interera/sankt-peterburg/'],...['chastnye-doma','development','gorodskaya-sreda'].map(s=>['architecture-'+s,'/ratings/arhitekturnye-byuro/moskva/'+s+'/'])]){
 const id=Object.keys(catalog[key])[0];const d=validate({...sample(),studio:id,page:path});assert.equal(d.studioName,catalog[key][id]);assert.throws(()=>validate({...sample(),studio:'VRN004',page:path}));
 assert.equal(validate({...sample(),studio:'brief',page:path,area:'100',location:'Тестовый город',brief:'Тестовый подробный проект для проверки',audience:'selected',priceSegment:'any',selected:[id]}).selectedNames[0],catalog[key][id]);
 }
});

test('Salomatina promo is a valid recipient outside the organic city ranking',()=>{
 for(const city of ['yekaterinburg','sankt-peterburg']){
 const d=validate({...sample(),page:'/ratings/dizayn-interera/'+city+'/'});assert.equal(d.studioName,'Alina Salomatina Interiors');
 }
});
