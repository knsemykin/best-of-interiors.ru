import research from './yekaterinburg-studios.json';
import {criteria as shared,type Studio} from './moscow';
export const path='/ratings/dizayn-interera/yekaterinburg/';
export const criteria=shared.map(([name,weight,description],i)=>[name,weight,({4:'0,5 — реализация заявлена в материалах; 1 — независимое подтверждение. В этом выпуске максимум 0,5.',5:'1 — названы проекты или ЖК; 0,5 — установлена местная связь.',6:'1 — опубликована цена проекта с 3D и чертежами; 0,5 — частичная или спорная цена.',9:'0,7 — опубликован адрес; 0,3 — телефон.'} as Record<number,string>)[i]||description] as const);
export const studios=research.studios.map(s=>({...s,segment:'Жилые интерьеры',design_currency:'RUB',design_price_unit:'за м²',kind:'studio',listPosition:0} as unknown as Studio & {kind:string})).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'ru'));
for(const [i,s] of studios.entries()){s.listPosition=i+1;const calculated=s.criteria.reduce((sum,c,k)=>sum+c*research.weights[k],0);if(Math.abs(calculated-s.score)>.001||s.rank!==1+studios.filter(o=>o.score>s.score).length)throw Error('Yekaterinburg score/rank mismatch: '+s.studio_id);}
export const residential=studios;
export const commercial:Studio[]=[];
export const evidence=research.field_evidence.map(e=>({...e,status:e.observation}));
export const projects=research.residential_projects.map(p=>({...p,residential_complex:p.project_name}));
export const commercialStudios=research.commercial_studios;
export {price} from './moscow';
