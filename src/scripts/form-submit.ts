// Shared email transport. Never interpret an HTTP 200 alone as successful delivery.
export async function sendSubmission(data:Record<string,unknown>, subject:string, requestId:string){
 if(String(data.website||'').trim())throw new Error('Не удалось отправить форму. Обновите страницу и попробуйте снова.');
 const payload:Record<string,string>={_subject:subject,_template:'table',_url:location.href.split('#')[0],'Номер обращения':requestId,'Дата отправки':new Date().toISOString()};
 const labels:Record<string,string>={name:'Имя',phone:'Телефон',email:'Email',studio:'Получатель',selected:'Выбранные компании',audience:'Способ подбора',property:'Объект',area:'Площадь или количество',location:'Город',budget:'Бюджет',priceSegment:'Сегмент',service:'Услуга',start:'Начало работ',brief:'Подробное описание',comment:'Сообщение',company:'Компания',role:'Роль представителя',sources:'Источники',consent:'Согласие на обработку',transferConsent:'Согласие на передачу компаниям',page:'Страница',kind:'Тип обращения'};
 for(const [key,value] of Object.entries(data)){
  if(['website','requestId'].includes(key)||value==null)continue;
  const text=Array.isArray(value)?value.join('; '):typeof value==='boolean'?(value?'Да':'Нет'):String(value);
  payload[labels[key]||key]=text;
 }
 if(data.email)payload.email=String(data.email);
 const response=await fetch('https://formsubmit.co/ajax/hello@best-of-interiors.ru',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(30000)});
 const result=await response.json();
 if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Сервис не подтвердил отправку. Попробуйте позже или напишите на hello@best-of-interiors.ru.');
 return {id:requestId};
}
