import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sendSubmission,submissionBody} from '../src/scripts/form-submit.ts';
const data={name:'Тест',phone:'+70000000000',consent:true,transferConsent:true,selected:['Студия А','Студия Б'],brief:'Задача <script>unsafe</script>',audience:'selected',budget:'3–7 млн ₽',page:'/ratings/dizayn-interera/moskva/'};
test('FormToMail preserves quiz answers, escapes HTML, and returns reference only on confirmed success',async t=>{
 let request;
 t.mock.method(globalThis,'fetch',async(url,options)=>{request={url,...options};return new Response(JSON.stringify({statusCode:200,message:'Успешно отправлено'}));});
 assert.deepEqual(await sendSubmission(data,'Тестовая заявка','test-ref'),{id:'test-ref'});
 assert.equal(request.url,'https://api.formtomail.ru/send');
 const sent=JSON.parse(request.body);
 assert.equal(sent.title,'Тестовая заявка');
 assert.deepEqual(sent.body['Выбранные компании'],data.selected);
 assert.equal(sent.body['Бюджет'],data.budget);
 assert.equal(sent.body['Согласие на передачу компаниям'],true);
 assert.equal(sent.body['Подробное описание задачи'],'Задача &lt;script&gt;unsafe&lt;/script&gt;');
 assert.equal(sent.honeypot,'');
});
test('HTTP 200 without service confirmation, expired key, malformed and network responses are errors',async t=>{
 for(const response of [()=>new Response('{}'),()=>new Response('{"statusCode":403}',{status:403}),()=>new Response('<html>error</html>'),()=>Promise.reject(new TypeError('network'))]){
  const mock=t.mock.method(globalThis,'fetch',response);
  await assert.rejects(sendSubmission(data,'Тест','test-ref'));
  mock.mock.restore();
 }
});
test('honeypot and missing consent never send; editorial only needs processing consent',async t=>{
 const mock=t.mock.method(globalThis,'fetch',async()=>new Response('{"statusCode":200}'));
 await assert.rejects(sendSubmission({...data,website:'bot'},'Тест','ref'));
 await assert.rejects(sendSubmission({...data,consent:false},'Тест','ref'));
 await assert.rejects(sendSubmission({...data,transferConsent:false},'Тест','ref'));
 assert.equal(mock.mock.callCount(),0);
 await sendSubmission({kind:'correction',consent:true,comment:'Исправление'},'Тест','ref');
 assert.equal(mock.mock.callCount(),1);
});
test('internal transport fields are excluded from the email',()=>{
 const body=submissionBody({...data,website:'',requestId:'old',transportVersion:2},'new');
 assert.equal(body.requestId,undefined);assert.equal(body.website,undefined);assert.equal(body.transportVersion,undefined);
 assert.equal(body['Номер обращения'],'new');
});
