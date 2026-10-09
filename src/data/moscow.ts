import research from './moscow-studios.json';
export const criteria = [
 ['Ремонт / реализация',15,'1 — заявлены ремонт или строительство; 0,5 — только сопровождение или поиск подрядчиков.'],
 ['Авторское сопровождение',10,'1 — услуга заявлена в официальных материалах.'],
 ['Комплектация',10,'1 — услуга заявлена в официальных материалах.'],
 ['Рабочая документация',10,'1 — рабочие чертежи заявлены в составе услуг.'],
 ['Сведения о реализации',15,'0,5 — компания обозначает работы как реализованные. 1 — независимая проверка кейсов; в этом выпуске таких проверок нет.'],
 ['Проекты / услуги в регионе',10,'1 — найдено название конкретного ЖК; 0,5 — заявлены услуги или проекты в регионе. Это не подтверждение сдачи объекта.'],
 ['Открытость цен',10,'1 — опубликована сопоставимая ставка проекта в рублях или явная ставка в USD; 0,5 — другие числовые цены. Валюты не пересчитываем.'],
 ['Срок работы',5,'1 — от 10 календарных лет; 0,5 — менее 10. По заявлению компании, без проверки юридического лица.'],
 ['Раскрытие состава команды',5,'1 — опубликована численность. Большая команда не получает больше баллов.'],
 ['Офис и контакты',10,'0,7 — заявлен офис в Москве или МО; 0,3 — опубликован российский телефон. Офис и телефон отдельно не проверялись.'],
] as const;
export const studios = [...research.studios].sort((a,b)=>a.segment.localeCompare(b.segment,'ru') || b.score-a.score || a.name.localeCompare(b.name,'ru'));
export type Studio = typeof studios[number];
export const residential = studios.filter(s=>s.segment==='Жилые интерьеры');
export const commercial = studios.filter(s=>s.segment!=='Жилые интерьеры');
export const evidence = research.field_evidence;
export const projects = research.residential_projects;
export const price = (s:Studio) => s.design_rub_m2_from && s.design_currency==='RUB' ? `от ${s.design_rub_m2_from.toLocaleString('ru-RU')} ₽/м²` : s.design_currency==='USD' ? 'Ставка в USD · уточнить' : 'Стоимость уточнить';
export const score = (n:number)=>n.toLocaleString('ru-RU',{maximumFractionDigits:1});
export const path='/ratings/dizayn-interera/moskva/';
export const labels:Record<string,string>={name:'Название',website:'Сайт',office_address:'Офис',year_started:'Начало работы',team_size_declared:'Команда',design_rub_m2_from:'Стоимость',author_supervision:'Сопровождение',procurement:'Комплектация',renovation_service:'Реализация',working_drawings:'Чертежи',phone:'Телефон',styles_mentioned:'Стили',usp_declared:'Подход',portfolio_evidence:'Портфолио',services:'Услуги',residential_complexes:'ЖК',procurement_orders:'Закупки',region_model:'Присутствие в регионе',youtube:'Видеоканал'};
// Fail the build rather than publish an accidentally changed index or rank.
for(const s of studios){
 const calculated=s.criteria.reduce((sum,n,i)=>sum+n*research.weights[i],0);
 if(Math.abs(calculated-s.score)>.011)throw new Error(`Score mismatch: ${s.studio_id}`);
 const rank=1+studios.filter(other=>other.segment===s.segment && other.score>s.score).length;
 if(rank!==s.rank)throw new Error(`Rank mismatch: ${s.studio_id}`);
}
