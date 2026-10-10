// Bundle this file as index.js (CommonJS) with server.mjs and studios.json.
const {Readable}=require('node:stream');
let handlerPromise;
exports.makeAdapter=(handler)=>async(event)=>{
 const headers=Object.fromEntries(Object.entries(event.headers||{}).map(([k,v])=>[k.toLowerCase(),v]));
 const body=event.isBase64Encoded?Buffer.from(event.body||'','base64'):Buffer.from(event.body||'');
 if(body.length>24000)return {statusCode:413,body:JSON.stringify({error:'Описание слишком длинное.'})};
 const req=Readable.from([body]);req.url='/leads';req.method=event.httpMethod;req.headers=headers;
 req.socket={remoteAddress:event.requestContext?.identity?.sourceIp||'unknown'};
 const result={statusCode:200,headers:{},body:'',isBase64Encoded:false};
 const res={setHeader:(k,v)=>{result.headers[k]=v;},writeHead:c=>{result.statusCode=c;},end:b=>{result.body=b||'';}};
 await handler(req,res);return result;
};
exports.handler=async(event)=>{
 if(!handlerPromise)handlerPromise=(async()=>{
  const {createHandler,letter}=await import('./server.mjs');
  const nodemailer=require('nodemailer');
  if(!process.env.SMTP_USER||!process.env.SMTP_PASSWORD)throw Error('SMTP configuration missing');
  const transport=nodemailer.createTransport({host:'smtp.timeweb.ru',port:465,secure:true,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD},connectionTimeout:8000,greetingTimeout:8000,socketTimeout:18000,disableFileAccess:true,disableUrlAccess:true});
  return exports.makeAdapter(createHandler(async(d,id)=>{
   const result=await transport.sendMail({from:{name:'Best of Interiors',address:process.env.SMTP_USER},to:'hello@best-of-interiors.ru',...(d.email?{replyTo:d.email}:{}),subject:`${d.kind==='correction'?'Исправление карточки':d.kind==='cooperation'?'Сотрудничество':'Заявка с сайта'} · ${d.city==='samara'?'Самара':d.city==='russia'?'Россия':d.city==='krasnodar'?'Краснодар':d.city==='rostov-na-donu'?'Ростов-на-Дону':d.city==='chelyabinsk'?'Челябинск':d.city==='nizhny-novgorod'?'Нижний Новгород':d.city==='kazan'?'Казань':d.city==='yekaterinburg'?'Екатеринбург':d.city==='sankt-peterburg'?'Санкт-Петербург':d.city==='voronezh'?'Воронеж':'Москва'} · ${id.slice(0,8)}`,text:letter(d,id)});
   if(!result.accepted?.length)throw Error('SMTP recipient not accepted');
  }));
 })().catch(error=>{handlerPromise=undefined;throw error;});
 try{return await(await handlerPromise)(event);}catch{return {statusCode:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify({error:'Сервис отправки временно недоступен.'})};}
};
