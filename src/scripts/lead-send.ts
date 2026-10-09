const form=document.querySelector<HTMLFormElement>('#lead-form');
if(form){
 let sending=false;
 let requestId=crypto.randomUUID();
 form.addEventListener('reset',()=>{if(!sending)requestId=crypto.randomUUID();});
 form.addEventListener('lead:submit',async(event)=>{
  if(sending)return;
  const endpoint=form.dataset.endpoint;
  const error=document.querySelector<HTMLElement>('#form-error')!;
  if(!endpoint){error.textContent='Приём заявок скоро откроется. Напишите нам: hello@best-of-interiors.ru.';return;}
  const selected=(event as CustomEvent<{selected?:string[]}>).detail?.selected||[];
  // Earlier quiz steps are disabled only for browser validation; include their answers.
  const disabled=[...form.querySelectorAll<HTMLFieldSetElement>('fieldset:disabled')];disabled.forEach(f=>f.disabled=false);
  const data=Object.fromEntries(new FormData(form).entries());disabled.forEach(f=>f.disabled=true);
  const payload={...data,consent:data.consent==='on',transferConsent:data.transferConsent==='on',selected,requestId,page:location.pathname};
  sending=true;const submit=document.querySelector<HTMLButtonElement>('#lead-submit')!;submit.disabled=true;submit.textContent='Отправляем…';error.textContent='';
  try{
   const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(30000)});
   const result=await response.json();if(!response.ok||!result.ok)throw Error(result.error||'Не удалось отправить заявку. Попробуйте позже.');
   form.hidden=true;const panel=document.querySelector<HTMLElement>('#lead-result')!;panel.hidden=false;panel.focus();
   document.querySelector<HTMLElement>('#lead-reference')!.textContent=`Номер заявки: ${result.id.slice(0,8)}`;
  }catch(e){error.textContent=e instanceof Error&&e.name!=='TimeoutError'?e.message:'Не удалось получить подтверждение. Проверьте соединение и попробуйте позже.';}
  finally{sending=false;submit.disabled=false;submit.textContent='Отправить заявку ↗';}
 });
}
