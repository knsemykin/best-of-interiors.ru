// Shared email transport. Never interpret an HTTP 200 alone as successful delivery.
export async function sendSubmission(data:Record<string,unknown>, _subject:string, requestId:string){
 if(String(data.website||'').trim())throw new Error('Не удалось отправить форму. Обновите страницу и попробуйте снова.');
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),35000);
 try{
  const response=await fetch('https://functions.yandexcloud.net/d4eop20jdj5s36ef87ad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,transportVersion:2,requestId}),signal:controller.signal});
  const result=await response.json();
  if(!response.ok||result.ok!==true||typeof result.id!=='string')throw new Error(result.error||'Почтовый сервер не подтвердил отправку. Попробуйте позже.');
  return {id:result.id};
 }catch(e){
  if(e instanceof TypeError||(e instanceof Error&&e.name==='AbortError'))throw new Error('Нет связи с сервисом отправки. Данные остались в форме. Попробуйте ещё раз или напишите hello@best-of-interiors.ru.');
  throw e;
 }finally{clearTimeout(timer);}
}
