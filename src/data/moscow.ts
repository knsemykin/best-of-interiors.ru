import research from './moscow-studios.json';
import updates from './editorial-updates.json';
export const criteria = [
 ['Ремонт / реализация',15,'1 — заявлены ремонт или строительство; 0,5 — только сопровождение или поиск подрядчиков.'],
 ['Авторское сопровождение',10,'1 — услуга заявлена в официальных материалах.'],
 ['Комплектация',10,'1 — услуга заявлена в официальных материалах.'],
 ['Рабочая документация',10,'1 — рабочие чертежи заявлены в составе услуг.'],
 ['Сведения о реализации',15,'0,5 — компания обозначает работы как реализованные. 1 — сведения о нескольких кейсах с сопоставлением проекта и результата, включая данные, предоставленные редакции.'],
 ['Проекты / услуги в регионе',10,'1 — найдено название конкретного ЖК; 0,5 — заявлены услуги или проекты в регионе. Это не подтверждение сдачи объекта.'],
 ['Открытость цен',10,'1 — опубликована сопоставимая ставка проекта в рублях или явная ставка в USD; 0,5 — другие числовые цены. Валюты не пересчитываем.'],
 ['Срок работы',5,'1 — от 10 календарных лет; 0,5 — менее 10. По заявлению компании, без проверки юридического лица.'],
 ['Раскрытие состава команды',5,'1 — опубликована численность. Большая команда не получает больше баллов.'],
 ['Офис и контакты',10,'0,7 — заявлен офис в Москве или МО; 0,3 — опубликован российский телефон. Офис и телефон отдельно не проверялись.'],
] as const;
export type Studio = typeof research.studios[number] & {draft_review?:string;yandex_rating?:number;yandex_count?:number;yandex_url?:string;listPosition?:number};
const corrections:Record<string,Partial<Studio>>=updates;
export const studios:Studio[] = research.studios.map(original=>{
 const s={...original,...corrections[original.studio_id]};
 return {...s,score:s.criteria.reduce((sum,n,i)=>sum+n*research.weights[i],0)};
}).sort((a,b)=>a.segment.localeCompare(b.segment,'ru') || b.score-a.score || a.name.localeCompare(b.name,'ru'));
for(const s of studios){s.rank=1+studios.filter(o=>o.segment===s.segment&&o.score>s.score).length;}
export const residential = studios.filter(s=>s.segment==='Жилые интерьеры');
export const commercial = studios.filter(s=>s.segment!=='Жилые интерьеры');
[...residential,...commercial].forEach((s,i)=>s.listPosition=i+1);
export const evidence = [...research.field_evidence.filter(e=>!(e.studio_id==='MSK005'&&e.field==='office_address')),
 {studio_id:'MSK005',studio:'Hot Walls',field:'office_address',value:'Москва, Холодильный переулок, 3, к1с8, офис 8217',source_url:'https://hot-walls.ru/interiors',source_type:'official_page',checked_at:'2026-10-09',status:'Адрес указан на официальной странице; офис не посещали'},
 {studio_id:'MSK006',studio:'Alina Salomatina',field:'yandex_rating',value:'5,0 / 43 оценки',source_url:'https://yandex.com/maps/org/alina_salomatina_interiors/61888887907/',source_type:'third_party',checked_at:'2026-10-09',status:'Рейтинг прочитан на Яндекс Картах; отзывы отдельно не проверялись и не участвуют в индексе'}];
export const projects = research.residential_projects;
export const price = (s:Studio) => s.studio_id==='MSK006' ? '3 990–8 500 ₽/м²' : s.design_rub_m2_from && s.design_currency==='RUB' ? `от ${s.design_rub_m2_from.toLocaleString('ru-RU')} ₽/м²` : s.design_currency==='USD' ? 'Ставка в USD · уточнить' : 'Стоимость уточнить';
export const score = (n:number)=>n.toLocaleString('ru-RU',{maximumFractionDigits:1});
export const path='/ratings/dizayn-interera/moskva/';
export const labels:Record<string,string>={name:'Название',website:'Сайт',office_address:'Офис',year_started:'Начало работы',team_size_declared:'Команда',design_rub_m2_from:'Стоимость',author_supervision:'Сопровождение',procurement:'Комплектация',renovation_service:'Реализация',working_drawings:'Чертежи',phone:'Телефон',styles_mentioned:'Стили',usp_declared:'Подход',portfolio_evidence:'Портфолио',services:'Услуги',residential_complexes:'ЖК',procurement_orders:'Закупки',region_model:'Присутствие в регионе',youtube:'Видеоканал',yandex_rating:'Оценки на Яндекс Картах'};
// Fail the build rather than publish an accidentally changed index or rank.
for(const s of studios){
 const calculated=s.criteria.reduce((sum,n,i)=>sum+n*research.weights[i],0);
 if(Math.abs(calculated-s.score)>.011)throw new Error(`Score mismatch: ${s.studio_id}`);
 const rank=1+studios.filter(other=>other.segment===s.segment && other.score>s.score).length;
 if(rank!==s.rank)throw new Error(`Rank mismatch: ${s.studio_id}`);
}
