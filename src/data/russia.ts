import * as moscow from './moscow';
import * as voronezh from './voronezh';
import * as spb from './spb';
import * as ekb from './yekaterinburg';
import * as kazan from './kazan';
import * as nn from './nizhny-novgorod';
import * as chl from './chelyabinsk';
import * as rnd from './rostov-na-donu';
import * as krd from './krasnodar';
export const path='/ratings/dizayn-interera/';
const selections=[
 [moscow,'MSK001','Москва','Лидер московского списка по индексу проекта.'],
 [voronezh,'VRN007','Воронеж','Лидер воронежского списка по индексу проекта.'],
 [spb,'SPB002','Санкт-Петербург','Один из лидеров петербургского списка при равном индексе.'],
 [ekb,'EKB001','Екатеринбург','Лидер екатеринбургского списка по индексу проекта.'],
 [kazan,'KZN014','Казань','Один из лидеров казанского списка при равном индексе.'],
 [nn,'NN013','Нижний Новгород','Лидер нижегородского списка по индексу проекта.'],
 [chl,'CHL006','Челябинск','Лидер челябинского списка. Опубликованную цену нужно уточнять.'],
 [rnd,'RND003','Ростов-на-Дону','Лидер ростовского списка по индексу проекта.'],
 [krd,'KRD005','Краснодар','Лидер краснодарского списка по индексу проекта.'],
 [moscow,'MSK006','Москва','Дополнительный выбор редакции: высокий индекс, проекты и сопоставление визуализации с результатом.'],
] as const;
export const studios=selections.map(([data,id,city,reason])=>{
 const s=data.studios.find(s=>s.studio_id===id);if(!s)throw Error('Missing national selection '+id);
 return {...s,kind:'studio',city,reason,sourcePath:data.path,regionalPosition:s.listPosition};
}).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'ru')).map((s,i)=>({...s,listPosition:i+1}));
export const residential=studios;
export const commercial=[];
export const commercialStudios=[];
export const evidence=selections.flatMap(([data,id])=>data.evidence.filter(e=>e.studio_id===id));
export const projects=selections.flatMap(([data,id])=>data.projects.filter(p=>p.studio_id===id));
export const criteria=moscow.criteria.map(([name,weight,description],i)=>[name,weight,i===9?'Адрес и телефон оцениваются относительно города исходного рейтинга.':i===5?'Учитываются названные проекты и сведения о работе в регионе исходного рейтинга.':description] as const);
export {price} from './moscow';
