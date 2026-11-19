// FormToMail documents this as a public browser-side sending key.
// Recipients are configured in its cabinet, never supplied by visitors.
const endpoint = 'https://api.formtomail.ru/send';
const sendingKey = 'W1RfmqNSZkjJxUTx';
const contact = 'pro.growthleads@gmail.com';
const labels: Record<string, string> = {
 name:'Имя', phone:'Телефон', email:'Email', studio:'Компания', selected:'Выбранные компании',
 company:'Название компании', role:'Роль в компании', comment:'Сообщение', sources:'Источники',
 property:'Тип объекта', area:'Площадь / количество конструкций', location:'Город / ЖК',
 budget:'Бюджет', brief:'Подробное описание задачи', start:'Срок начала', service:'Услуга',
 audience:'Способ подбора', priceSegment:'Сегмент', kind:'Тип обращения', city:'Город',
 consent:'Согласие на обработку данных', transferConsent:'Согласие на передачу компаниям', page:'Страница',
};
const choices: Record<string, string> = {
 editorial:'Подбор редакцией', selected:'Выбранные пользователем компании', any:'От эконома до премиума',
 economy:'Эконом', middle:'Средний', premium:'Премиум', correction:'Исправление информации', cooperation:'Сотрудничество',
};
const escapeText = (value: unknown) => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

export function submissionBody(data: Record<string, unknown>, requestId: string) {
 const body: Record<string, string | boolean | string[]> = {'Номер обращения':requestId};
 for(const [key, value] of Object.entries(data)) {
  if(['website','requestId','transportVersion'].includes(key) || value == null || value === '') continue;
  const display = ['audience','priceSegment','kind'].includes(key) ? choices[String(value)] || value : value;
  body[labels[key] || key] = typeof display === 'boolean' ? display : Array.isArray(display) ? display.map(escapeText) : escapeText(display);
 }
 return body;
}

export async function sendSubmission(data: Record<string, unknown>, subject: string, requestId: string) {
 if(String(data.website || '').trim()) throw new Error('Не удалось отправить форму. Обновите страницу и попробуйте снова.');
 if(data.consent !== true || (!['correction','cooperation'].includes(String(data.kind)) && data.transferConsent !== true))
  throw new Error('Отметьте согласие на обработку и передачу заявки.');
 const controller = new AbortController();
 const timer = setTimeout(() => controller.abort(), 25000);
 try {
  const response = await fetch(endpoint, {
   method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${sendingKey}`},
   body:JSON.stringify({title:subject, body:submissionBody(data,requestId), honeypot:''}), signal:controller.signal,
  });
  const result = await response.json().catch(() => null);
  if(!response.ok || result?.statusCode !== 200)
   throw new Error(`Сервис не подтвердил отправку. Данные остались в форме. Попробуйте позже или напишите ${contact}.`);
  return {id:requestId};
 } catch(error) {
  if(error instanceof TypeError || (error instanceof Error && error.name === 'AbortError'))
   throw new Error(`Нет связи с сервисом отправки. Данные остались в форме. Попробуйте ещё раз или напишите ${contact}.`);
  throw error;
 } finally {clearTimeout(timer);}
}
