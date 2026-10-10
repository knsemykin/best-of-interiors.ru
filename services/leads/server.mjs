import http from 'node:http';
import {randomUUID,createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import nodemailer from 'nodemailer';
import catalog from './studios.json' with {type:'json'};
const origins=new Set(['https://best-of-interiors.ru','https://www.best-of-interiors.ru']);
const architectureRoutes=Object.fromEntries(['chastnye-doma','development','gorodskaya-sreda'].map(s=>['/ratings/arhitekturnye-byuro/moskva/'+s+'/', 'architecture-'+s]));
const targets=new Set([...Object.keys(architectureRoutes),'/ratings/dizayn-interera/sankt-peterburg/','/ratings/dizayn-interera/moskva/','/ratings/dizayn-interera/voronezh/','/companies/alina-salomatina/']);
export function validate(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Неверный формат заявки.');
 const text=(key,max,required=false)=>{const v=input[key]??'';if(typeof v!=='string'||v.length>max||(required&&!v.trim()))throw Error('Проверьте поле: '+key);return v.trim();};
 const d={};for(const [k,max,req] of [['name',80,true],['phone',25,true],['email',180,false],['comment',5000,false],['kind',20,false],['company',150,false],['role',100,false],['sources',2000,false],['brief',5000,false],['property',80,false],['location',150,false],['area',10,false],['budget',100,false],['start',100,false],['service',100,false],['audience',20,false],['priceSegment',20,false],['studio',20,true],['page',150,true],['website',200,false],['requestId',50,true]])d[k]=text(k,max,req);
 if(d.name.length<2||!/^[-+0-9()\s]{7,25}$/.test(d.phone)||d.phone.replace(/\D/g,'').length<7)throw Error('Укажите имя и корректный телефон.');
 if(d.email&&!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(d.email))throw Error('Проверьте электронную почту.');
 d.kind=d.kind||'lead';if(!['lead','correction','cooperation'].includes(d.kind))throw Error('Неверный тип обращения.');
 if(d.kind==='lead'&&input.transferConsent!==true)throw Error('Необходимо согласие на передачу заявки студиям.');
 if(input.consent!==true)throw Error('Необходимо согласие на обработку данных.');
 if(!(targets.has(d.page)||(d.kind==='cooperation'&&['/','/partners/'].includes(d.page)))||!/^[0-9a-f-]{36}$/i.test(d.requestId))throw Error('Обновите страницу и повторите отправку.');
 const city=d.page.includes('sankt-peterburg')?'sankt-peterburg':d.page.includes('voronezh')?'voronezh':'moskva';d.city=city;
 const studioList=catalog[architectureRoutes[d.page]||city];
 if(d.studio!=='brief'&&!studioList[d.studio])throw Error('Студия не найдена в этом рейтинге.');
 if(d.kind!=='lead'){
  if(!d.company||!d.role||!d.email||d.comment.length<20||(d.kind==='correction'&&d.studio==='brief'))throw Error('Укажите компанию, вашу роль, почту и подробное сообщение.');
  d.studioName=studioList[d.studio]||d.company;return d;
 }
 d.selected=Array.isArray(input.selected)?input.selected:[];
 if(d.selected.length>4||d.selected.some(id=>typeof id!=='string'||!studioList[id]))throw Error('Проверьте список выбранных студий.');
 if(d.studio==='brief'){
  if(!['editorial','selected'].includes(d.audience)||d.brief.length<20||!d.location||Number(d.area)<10||Number(d.area)>(architectureRoutes[d.page]?100000000:100000)||!Number.isFinite(Number(d.area)))throw Error('Заполните площадь, город и подробное описание проекта.');
  if(d.audience==='selected'&&!d.selected.length)throw Error('Выберите студии для сравнения.');
 }
 if(d.studio==='brief'&&!['any','economy','middle','premium'].includes(d.priceSegment))throw Error('Выберите ценовой сегмент.');
 if(d.studio!=='brief'){d.audience='selected';d.selected=[d.studio];}else if(d.audience==='editorial'){d.selected=[];}
 d.studioName=studioList[d.studio]||'Общий бриф';d.selectedNames=d.selected.map(id=>studioList[id]);return d;
}
export function letter(d,id){if(d.kind!=='lead')return [`${d.kind==='correction'?'Исправление информации':'Сотрудничество'} Best of Interiors № ${id}`,`Дата: ${new Date().toISOString()}`,`Страница: https://best-of-interiors.ru${d.page}`,`Карточка: ${d.studioName} (${d.studio})`,`Компания: ${d.company}`,`Представитель: ${d.name}`,`Роль: ${d.role}`,`Телефон: ${d.phone}`,`Email: ${d.email}`,`Сообщение: ${d.comment}`,`Материалы: ${d.sources||'Не указаны'}`,'Согласие на обработку обращения: дано. Версия: 2026-10-10. Только редакции; изменения требуют проверки.'].join('\n');return [
 `Новая заявка Best of Interiors № ${id}`,`Дата: ${new Date().toISOString()}`,
 `Город рейтинга: ${d.city==='sankt-peterburg'?'Санкт-Петербург':d.city==='voronezh'?'Воронеж':'Москва'}`,`Страница: https://best-of-interiors.ru${d.page}`,
 `Студия: ${d.studioName} (${d.studio})`,`Имя: ${d.name}`,`Телефон: ${d.phone}`,`Email: ${d.email||'Не указан'}`,
 `Тип объекта: ${d.property}`,`Площадь: ${d.area}`,`Город / ЖК: ${d.location}`,`Бюджет: ${d.budget}`,`Начало: ${d.start}`,`Услуги: ${d.service}`,
 `Подбор: ${d.audience==='editorial'?'Редакцией под задачу и бюджет':'Конкретные студии'}`,`Сегмент: ${{any:'От эконома до премиума с учётом бюджета',economy:'Эконом',middle:'Средний',premium:'Премиум'}[d.priceSegment]||'Не указан'}`,`Выбранные студии: ${d.selectedNames.join(', ')||'Не выбраны'}`,
 `\nОписание проекта:\n${d.brief||d.comment||'Не указано'}`,
 '\nСогласие на обработку данных: дано. Согласие на передачу выбранным клиентом или редакцией студиям для КП: дано. Версия: 2026-10-09-v2. Получатель заявки — редакция Best of Interiors. Автоматическая рассылка студиям не выполнялась.'
 ].join('\n');}
export function createHandler(send,{maxPerWindow=5,maxGlobal=40}={}){
 const rates=new Map(),requests=new Map();let globalCount=0,globalUntil=Date.now()+3600000;
 const clean=setInterval(()=>{const now=Date.now();for(const[k,v]of rates)if(v.until<now)rates.delete(k);for(const[k,v]of requests)if(v.until<now)requests.delete(k);},60000);clean.unref();
 return async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Content-Type','application/json; charset=utf-8');
  const reply=(code,value)=>{res.writeHead(code);res.end(JSON.stringify(value));};
  if(req.url==='/health'&&req.method==='GET')return reply(200,{ok:true});
  if(req.url!=='/leads')return reply(404,{error:'Not found'});
  const origin=req.headers.origin;
  if(!origins.has(origin))return reply(403,{error:'Запрос разрешён только с сайта.'});
  res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');
  if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','POST');res.setHeader('Access-Control-Allow-Headers','Content-Type');return reply(204,{});}
  if(req.method!=='POST')return reply(405,{error:'Method not allowed'});
  if(!req.headers['content-type']?.startsWith('application/json'))return reply(415,{error:'Неверный формат.'});
  let raw='';try{for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>24000){reply(413,{error:'Описание слишком длинное.'});return;}}}catch{return;}
  let d;try{d=validate(JSON.parse(raw));}catch(e){return reply(400,{error:e.message});}
  if(d.website)return reply(400,{error:'Не удалось проверить заявку.'});
  const hash=createHash('sha256').update(JSON.stringify(d)).digest('hex'),prior=requests.get(d.requestId);
  if(prior){if(prior.hash!==hash)return reply(409,{error:'Заявка изменилась. Обновите форму.'});if(prior.id)return reply(200,{ok:true,id:prior.id});return reply(409,{error:'Заявка уже отправляется. Подождите немного.'});}
  const now=Date.now();if(now>globalUntil){globalCount=0;globalUntil=now+3600000;}
  // Never trust client-supplied forwarding headers. Global cap also protects SMTP quota.
  const ip=req.socket.remoteAddress||'unknown';let rate=rates.get(ip);if(!rate||now>rate.until){rate={count:0,until:now+600000};rates.set(ip,rate);}
  if(rate.count>=maxPerWindow||globalCount>=maxGlobal||requests.size>=2000){res.setHeader('Retry-After','600');return reply(429,{error:'Слишком много заявок. Повторите через 10 минут.'});}
  rate.count++;globalCount++;requests.set(d.requestId,{hash,until:now+86400000});
  const id=randomUUID();try{await send(d,id);requests.set(d.requestId,{hash,id,until:now+86400000});return reply(200,{ok:true,id});}
  catch{requests.delete(d.requestId);console.error('lead_delivery_failed',id);return reply(502,{error:'Почтовый сервер не подтвердил отправку. Попробуйте позже или напишите hello@best-of-interiors.ru.'});}
 };
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 for(const key of ['SMTP_USER','SMTP_PASSWORD'])if(!process.env[key])throw Error('Missing '+key);
 const transport=nodemailer.createTransport({host:'smtp.timeweb.ru',port:465,secure:true,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:20000,disableFileAccess:true,disableUrlAccess:true});
 await transport.verify();
 const handler=createHandler(async(d,id)=>{const result=await transport.sendMail({from:{name:'Best of Interiors',address:process.env.SMTP_USER},to:'hello@best-of-interiors.ru',...(d.email?{replyTo:d.email}:{}),subject:`${d.kind==='correction'?'Исправление карточки':d.kind==='cooperation'?'Сотрудничество':'Заявка с сайта'} · ${d.city==='sankt-peterburg'?'Санкт-Петербург':d.city==='voronezh'?'Воронеж':'Москва'} · ${id.slice(0,8)}`,text:letter(d,id)});if(!result.accepted?.length)throw Error('SMTP recipient not accepted');});
 const server=http.createServer(handler);server.requestTimeout=30000;server.headersTimeout=15000;server.listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('Lead service ready'));
}
