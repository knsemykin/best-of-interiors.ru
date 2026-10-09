import './gallery';
const $ = <T extends HTMLElement = HTMLElement>(selector:string)=>document.querySelector<T>(selector)!;
const cards=[...document.querySelectorAll<HTMLElement>('[data-studio]')];
const list=$('#studio-list');
const search=$<HTMLInputElement>('#search');
const segment=$<HTMLSelectElement>('#segment');
const budget=$<HTMLSelectElement>('#budget');
const office=$<HTMLSelectElement>('#office');
const sort=$<HTMLSelectElement>('#sort');
const filterForm=$<HTMLFormElement>('#filters');
let visibleLimit=50, matches:HTMLElement[]=[];
const normalize=(v:string)=>v.toLocaleLowerCase('ru').replace(/ё/g,'е').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
function applyFilters(scroll=false){
 const terms=normalize(search.value).split(' ').filter(Boolean);
 matches=cards.filter(card=>{
  const d=card.dataset, amount=Number(d.price||0);
  if(segment.value!=='all' && segment.value!==d.segment)return false;
  const kind=document.querySelector<HTMLSelectElement>('#team-type');if(kind&&kind.value!=='all'&&kind.value!==d.kind)return false;
  if(office.value!=='all'&&office.value!==d.office)return false;
  if(terms.some(term=>!normalize(d.search||'').includes(term)))return false;
  if(budget.value==='known'&&!amount || budget.value==='unknown'&&amount)return false;
  if(!['all','known','unknown'].includes(budget.value)&&(!amount||amount>Number(budget.value)))return false;
  return ['supervision','procurement','renovation'].every(key=>!$<HTMLInputElement>('#'+key).checked||d[key]==='true');
 });
 matches.sort((a,b)=>sort.value==='name'?(a.dataset.name||'').localeCompare(b.dataset.name||'','ru'):sort.value==='price'?(Number(a.dataset.price)||Infinity)-(Number(b.dataset.price)||Infinity)||(a.dataset.name||'').localeCompare(b.dataset.name||'','ru'):Number(b.dataset.score)-Number(a.dataset.score)||(a.dataset.name||'').localeCompare(b.dataset.name||'','ru'));
 cards.forEach(card=>card.hidden=true);
 const visible=matches.slice(0,visibleLimit);
 visible.forEach(card=>{list.append(card);card.hidden=false;});
 $('#result-count').textContent=`Найдено: ${matches.length} из ${cards.length}`;
 $('#empty-state').hidden=!!matches.length;
 $('#page-status').textContent=`Показано ${visible.length} из ${matches.length}`;
 $('#load-more').hidden=visible.length>=matches.length;
 $('#load-more').textContent=`Показать ещё ${Math.min(10,matches.length-visible.length)} студий ↓`;
 if(scroll)$('#rating').scrollIntoView({block:'start',behavior:'instant'});
}
filterForm.addEventListener('submit',e=>e.preventDefault());
filterForm.addEventListener('input',()=>{visibleLimit=50;applyFilters();});
filterForm.addEventListener('reset',()=>{setTimeout(()=>{visibleLimit=50;sort.value='score';applyFilters();},0);});
sort.addEventListener('change',()=>{visibleLimit=50;applyFilters();});
$('#empty-reset').addEventListener('click',()=>filterForm.reset());
$('#load-more').addEventListener('click',()=>{const firstNew=matches[visibleLimit];visibleLimit+=10;applyFilters();if(firstNew){firstNew.tabIndex=-1;firstNew.focus({preventScroll:true});firstNew.scrollIntoView({block:'start',behavior:'instant'});}});
function revealHash(){
 const id=decodeURIComponent(location.hash.slice(1));const card=cards.find(c=>c.id===id);if(!card)return;
 filterForm.reset();
 setTimeout(()=>{search.value='';segment.value=card.dataset.segment!;budget.value='all';office.value='all';sort.value='score';visibleLimit=50;applyFilters();visibleLimit=Math.max(50,Math.ceil((matches.indexOf(card)+1)/10)*10);applyFilters();requestAnimationFrame(()=>card.scrollIntoView({block:'start',behavior:'instant'}));},1);
}
applyFilters();revealHash();window.addEventListener('hashchange',revealHash);

// Session-only shortlist. No personal data or tracking storage.
const selected=new Set<string>();
const compare=$<HTMLDialogElement>('#compare-dialog');
function refreshSelection(){
 document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach(button=>{const saved=selected.has(button.dataset.save!);button.setAttribute('aria-pressed',String(saved));button.textContent=saved?'✓':'＋';button.setAttribute('aria-label',`${saved?'Убрать':'Добавить'} ${cards.find(c=>c.id===button.dataset.save)?.dataset.name} ${saved?'из сравнения':'в сравнение'}`);});
 $('#saved-count').textContent=String(selected.size);$('#compare-open').hidden=selected.size===0;
 $('#sticky-title').textContent=selected.size?`В сравнении: ${selected.size} из 4`:'Один бриф — много предложений.';
 $('#sticky-brief').hidden=false;
}
document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach(button=>button.addEventListener('click',()=>{
 const id=button.dataset.save!;
 if(selected.has(id))selected.delete(id);else if(selected.size<4)selected.add(id);else{$('#result-count').textContent='В сравнении уже 4 студии. Уберите одну, чтобы добавить другую.';return;}refreshSelection();
}));
function cell(tag:string,text:string){const el=document.createElement(tag);el.textContent=text;return el;}
function renderComparison(){
 const container=$('#compare-content');container.replaceChildren();
 if(!selected.size){container.append(cell('p','Список пока пуст. Добавьте студии кнопкой «+» в карточках.'));$('#compare-brief').hidden=true;return;}
 $('#compare-brief').hidden=false;
 const table=document.createElement('table');const caption=document.createElement('caption');caption.textContent='Сведения из карточек. Услуги заявлены компаниями.';table.append(caption);
 const head=document.createElement('thead'),row=document.createElement('tr');row.append(cell('th','Что сравниваем'));
 const chosen=cards.filter(c=>selected.has(c.id));
 chosen.forEach(card=>{const th=cell('th',card.dataset.name!);const remove=document.createElement('button');remove.textContent='Убрать из сравнения';remove.dataset.remove=card.id;remove.addEventListener('click',()=>{selected.delete(card.id);refreshSelection();renderComparison();});th.append(remove);row.append(th);});head.append(row);table.append(head);
 const body=document.createElement('tbody');
 const rows:[string,(c:HTMLElement)=>string][]=[['Направление',c=>c.dataset.kind?({studio:'Студия / бюро',author:'Авторская команда',renovation:'Ремонт и дизайн'}[c.dataset.kind]||'Студия'):c.dataset.segment==='home'?'Жилые интерьеры':'Бизнес / архитектура'],['Индекс сведений',c=>`${Number(c.dataset.score).toLocaleString('ru-RU')} / 100`],['Дизайн-проект',c=>c.querySelector('.studio-facts dd')?.textContent||'Уточнить'],['Офис',c=>c.querySelector('.studio-location')?.textContent||'Уточнить'],['Сопровождение',c=>c.dataset.supervision==='true'?'Заявлено':'Уточните у студии'],['Комплектация',c=>c.dataset.procurement==='true'?'Заявлено':'Уточните у студии'],['Реализация',c=>c.dataset.renovation==='true'?'Заявлено':'Уточните у студии']];
 rows.forEach(([name,value])=>{const tr=document.createElement('tr');const th=cell('th',name);th.setAttribute('scope','row');tr.append(th);chosen.forEach(c=>tr.append(cell('td',value(c))));body.append(tr);});table.append(body);const wrapper=document.createElement('div');wrapper.className='compare-table-wrap';wrapper.append(table);container.append(wrapper);
}
$('#compare-open').addEventListener('click',()=>{renderComparison();compare.showModal();});
$('#sticky-dismiss').addEventListener('click',()=>$('#sticky-brief').hidden=true);

const lead=$<HTMLDialogElement>('#lead-dialog');const form=$<HTMLFormElement>('#lead-form');
let quiz=false,step=2;
function showStep(){
 form.querySelectorAll<HTMLFieldSetElement>('[data-step]').forEach(field=>{const active=Number(field.dataset.step)===step;field.hidden=!active;field.disabled=!active;});
 $('#quiz-progress').hidden=!quiz;
 document.querySelectorAll('#quiz-progress span').forEach((el,i)=>el.classList.toggle('active',i<=step));
 $('#quiz-back').hidden=!quiz||step===0;$('#quiz-next').hidden=!quiz||step===2;$('#lead-submit').hidden=quiz&&step!==2;$('#short-note').hidden=quiz;
 $<HTMLTextAreaElement>('[name=comment]').disabled=quiz;
 $('#form-error').textContent='';
}
function openLead(id?:string,fromCompare=false){
 quiz=!id;step=quiz?0:2;form.reset();form.hidden=false;$('#lead-result').hidden=true;
 const studio=cards.find(c=>c.id===id);
 $<HTMLInputElement>('#lead-studio').value=studio?.id||'brief';
 $('#lead-title').textContent=quiz?'Ваш проект. Один бриф.':'Познакомимся поближе?';
 $('#lead-recipient').textContent=studio?`Персональное предложение от ${studio.dataset.name}`:'Опишите задачу, чтобы сравнивать предложения на одинаковых условиях.';
 $<HTMLSelectElement>('#brief-audience').value=fromCompare?'selected':'home';
 if(fromCompare)$('#audience-note').textContent='Вы выбрали: '+cards.filter(c=>selected.has(c.id)).map(c=>c.dataset.name).join(', ')+'. Заявка поступит редакции.';
 else $('#audience-note').textContent='Выбор попадёт в заявку редакции. Автоматическая рассылка по всем студиям не выполняется.';
 showStep();lead.showModal();
}
document.querySelectorAll<HTMLButtonElement>('[data-lead]').forEach(button=>button.addEventListener('click',()=>openLead(button.dataset.lead)));
document.querySelectorAll<HTMLButtonElement>('[data-quiz]').forEach(button=>button.addEventListener('click',()=>openLead()));
$('#brief-audience').addEventListener('change',()=>{const value=$<HTMLSelectElement>('#brief-audience').value;$('#audience-note').textContent=value==='selected'?(selected.size?'Вы выбрали: '+cards.filter(c=>selected.has(c.id)).map(c=>c.dataset.name).join(', ')+'. Заявка поступит редакции.':'Добавьте студии в сравнение или выберите другое направление.'):'Выбор попадёт в заявку редакции. Автоматическая рассылка по всем студиям не выполняется.';});
$('#compare-brief').addEventListener('click',()=>{compare.close();openLead(undefined,true);});
function validStep(){
 const fields=[...form.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>(`[data-step="${step}"] input,[data-step="${step}"] select,[data-step="${step}"] textarea`)];
 const invalid=fields.find(field=>!field.disabled&&!field.checkValidity());if(invalid){invalid.reportValidity();return false;}
 if(quiz&&step===1&&$<HTMLSelectElement>('#brief-audience').value==='selected'&&!selected.size){$('#form-error').textContent='Сначала добавьте студии в сравнение или выберите другое направление.';return false;}
 if(step===2){const phone=$<HTMLInputElement>('[name=phone]');if(phone.value.replace(/\D/g,'').length<7||!/^[-+0-9()\s]+$/.test(phone.value)){$('#form-error').textContent='Укажите телефон: не менее 7 цифр.';phone.focus();return false;}}
 return true;
}
$('#quiz-next').addEventListener('click',()=>{if(validStep()){step++;showStep();form.querySelector<HTMLElement>(`[data-step="${step}"] input,[data-step="${step}"] textarea`)?.focus();}});
$('#quiz-back').addEventListener('click',()=>{step--;showStep();});
form.addEventListener('submit',event=>{event.preventDefault();if(quiz&&step<2){if(validStep()){step++;showStep();}return;}if(!validStep())return;form.dispatchEvent(new CustomEvent('lead:submit',{detail:{selected:quiz&&$<HTMLSelectElement>('#brief-audience').value==='selected'?[...selected]:[]}}));});
[lead,compare].forEach(dialog=>{dialog.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});});
lead.addEventListener('close',()=>form.reset());

function calculate(){const area=$<HTMLInputElement>('#calc-area'),rate=$<HTMLInputElement>('#calc-rate');$('#calc-result').textContent=area.value&&rate.value&&area.checkValidity()&&rate.checkValidity()?`${(Number(area.value)*Number(rate.value)).toLocaleString('ru-RU')} ₽`:'Уточните значения';}
$('#calc-area').addEventListener('input',calculate);$('#calc-rate').addEventListener('input',calculate);
const preference=matchMedia('(prefers-reduced-motion: reduce)');let paused=preference.matches;
const motion=$<HTMLButtonElement>('.rank-motion');
function updateMotion(){document.documentElement.dataset.rankingMotion=paused?'paused':'running';motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'Включить анимацию':'Приостановить анимацию');motion.textContent=paused?'▷':'Ⅱ';}
motion.addEventListener('click',()=>{paused=!paused;updateMotion();});preference.addEventListener('change',()=>{paused=preference.matches;updateMotion();});updateMotion();
