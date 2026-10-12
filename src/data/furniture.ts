import data from './furniture-moscow.json';
export const furniturePages=data.pages;
export const labels:Record<string,string>={kuhni:'Кухни на заказ','korpusnaya-mebel':'Корпусная мебель',shkafy:'Шкафы на заказ',garderobnye:'Гардеробные',divany:'Диваны',krovati:'Кровати'};
export const criterionNames=['Профиль и выбор','Производственная информация','Материалы и технологии','Сервис','Гарантия','Контакты и цены'];
export const weights=data.score_weights;
export function entries(page:typeof data.pages[number]){return page.rankings.map(r=>{
 const company=data.companies.find(c=>c.id===r.company_id);
 if(!company||r.score_components.reduce((a,b)=>a+b,0)!==r.score)throw new Error('Invalid furniture entry '+r.company_id);
 return {...company,...r,criteria:[r.profile_criterion,...company.rating_base_criteria],tied:page.rankings.filter(x=>x.score===r.score).length>1};
});}
