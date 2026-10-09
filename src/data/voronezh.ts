import research from './voronezh-studios.json';
import {criteria as commonCriteria,type Studio} from './moscow';
export const path='/ratings/dizayn-interera/voronezh/';
export const criteria=commonCriteria.map((c,i)=>i===4?[c[0],c[1],'0,5 — компания обозначает работы как реализованные; 1 — независимая проверка кейсов. В этом выпуске применяется максимум 0,5.'] as const:c);
export const studios=research.studios.map(s=>({...s,segment:'Жилые интерьеры',design_currency:'RUB',design_price_unit:'за м²',score:s.criteria.reduce((sum,c,i)=>sum+c*research.weights[i],0),listPosition:0,kind:s.entity_type.includes('ремонта')?'renovation':s.entity_type.includes('Частный')?'author':'studio'} as unknown as Studio & {kind:string})).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'ru'));
for(const [i,s] of studios.entries()){s.listPosition=i+1;s.rank=1+studios.filter(o=>o.score>s.score).length;const original=research.studios.find(o=>o.studio_id===s.studio_id)!;if(s.score!==original.score||s.rank!==original.rank)throw new Error('Voronezh score mismatch: '+s.studio_id);}
export const residential=studios;
export const commercial:Studio[]=[];
export const evidence=research.field_evidence.map(e=>({...e,studio:studios.find(s=>s.studio_id===e.studio_id)?.name,status:e.note}));
export const projects=research.residential_projects.map(p=>({...p,residential_complex:p.residential_complex_or_case}));
export {price} from './moscow';
