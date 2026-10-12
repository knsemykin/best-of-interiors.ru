import data from './voronezh-windows.json';
export const path='/ratings/okna/voronezh/';
export const criteria=data.criteria;
const root='https://voronezh.oknapeople.ru/';
const product=root+'okna/nedorogie-okna';
const original=data.companies.find(c=>c.name==='Oknapeople')!;
const points=[5,5,10,10,5,5,10,5,10,5];
const reasons=['Официальный сайт; реквизиты оператора требуют уточнения.','Местный телефон и шоурум; на сайте указаны разные номера корпуса.','Описано производство изделий из ПВХ и алюминия.','Указаны REHAU и параметры профильных систем.','Установка заявлена; подробная технология не установлена.','Встречаются 5 лет и до 7 лет; единые условия требуют уточнения.','Описаны гарантийная помощь и ремонт окон.','Есть цены и калькулятор; условия оплаты не установлены.','Показаны четыре подписанных примера остекления.','Профиль в справочнике из исследовательского пакета.'];
const oknapeople={...original,role:'Оконная компания: продажа, установка и сервис',production_status:'manufacture_claimed_location_unverified',address:'Воронеж, проспект Труда, 48к1 — шоурум; корпус уточните перед визитом',phone:'+7 (473) 212-20-81',email:'privet@oknapeople.ru',profiles:'REHAU; ПВХ 58, 70 и 76 мм',warranty:'На сайте встречаются 5 лет и до 7 лет. Срок для изделия и монтажа уточните в договоре.',services:'Окна ПВХ и алюминиевые конструкции, остекление балконов, установка, ремонт.',description:'Подбор остекления, установка и сервис. Есть шоурум и видеоконсультация.',notes:'Отдельный профиль Oknapeople. Собственная оценка по источникам от 12.10.2026; баллы ВОЗ не переносились.',publication_status:'published',verification_status:'primary_profile',sources:[root,product,...original.sources],assessment:criteria.map((c,i)=>({criterion_id:c.id,criterion:c.name,points:points[i],max_points:10,reason:reasons[i],rubric:c.rubric,source_urls:[i===9?original.sources[0]:[0,1,2,6].includes(i)?root:product]})),rating_score:points.reduce((a,b)=>a+b,0)};
// Editorial correction supplied on 12 October 2026; retain the original research above.
const vozOriginal=data.companies.find(c=>c.company_id==='win36_740cd963385c')!;
const corrections={
 identity:'Редакционная корректировка +5 от 12.10.2026: предоставлены ООО «ВОРОНЕЖСКИЙ ОКОННЫЙ ЗАВОД», ИНН 3662294012 и юридический адрес. Реквизиты получены редакцией при уточнении карточки.',
 warranty:'Редакционная корректировка +5 от 12.10.2026: в уточнении карточки указан срок гарантии 5 лет. На сайте — до 5 лет и гарантия на работы; конкретный охват и условия закрепляются в договоре. Дополнительные баллы начислены редакцией по предоставленному уточнению.',
 cases:'Редакционная корректировка +5 от 12.10.2026: повторно рассмотрена галерея «Наши реализованные объекты» на главной странице завода. Дополнительные баллы начислены редакцией за опубликованные фотографии объектов; подробные описания трёх проектов отдельно не установлены.'
};
const voz={...vozOriginal,
 legal_name:'ООО «ВОРОНЕЖСКИЙ ОКОННЫЙ ЗАВОД»',inn:'3662294012',
 legal_address:'394026, Воронежская область, городской округ город Воронеж, г. Воронеж, проспект Труда, д. 48',
 manufacturing_term:'Простое окно — 3 дня. Срок конкретного заказа согласуется в договоре.',
 warranty:'5 лет по предоставленным редакции сведениям. Условия на изделие и монтаж — в договоре.',
 yandex_rating:'5,0',yandex_rating_source:'По данным сайта компании на 12.10.2026',
 description:'Собственное производство окон, подбор комплектации, доставка и монтаж в Воронеже и области. Изготовление простого окна — 3 дня, заявленная гарантия — 5 лет. На сайте представлены фотографии реализованных объектов.',
 notes:'Оценка обновлена редакцией 12.10.2026 с учётом предоставленных реквизитов, уточнения гарантии и повторного просмотра галереи объектов. Основания редакционных корректировок раскрыты в баллах.',
 sources:vozOriginal.sources.filter(url=>!url.includes('oknapeople')),
 assessment:vozOriginal.assessment.map(a=>({...a,points:a.criterion_id in corrections?10:a.points,reason:corrections[a.criterion_id as keyof typeof corrections]||a.reason,source_urls:a.source_urls.filter(url=>!url.includes('oknapeople'))})),
 rating_score:100,rating_place:1
};
const scoredCompanies=[...data.companies.filter(c=>c.rating_score!==null&&c.company_id!==voz.company_id),voz,oknapeople];
export const companies=scoredCompanies.sort((a,b)=>(b.rating_score||0)-(a.rating_score||0)||a.name.localeCompare(b.name,'ru')).map((c,i)=>({...c,position:i+1,rank:1+scoredCompanies.filter(o=>(o.rating_score||0)>(c.rating_score||0)).length}));
for(const c of companies)if(c.assessment.reduce((n,a)=>n+a.points,0)!==c.rating_score)throw Error('Window score mismatch: '+c.name);
export const promos=[
 {id:'win36_740cd963385c',name:'Воронежский Оконный Завод',url:'https://vo-zavod.ru/',image:'/images/windows-garden-1200.webp',eyebrow:'ОТ ПРОИЗВОДСТВА ДО УСТАНОВКИ',title:'Больше тепла.\nМеньше лишних хлопот.',text:'Остекление под ваш дом и бюджет: от выбора конструкции до установки. Начните с расчёта в трёх вариантах, чтобы увидеть разницу в комплектации.',benefits:['Простое окно — за 3 дня','Гарантия — 5 лет, условия в договоре','Бесплатный замер по Воронежу'],offer:'«Дачное окно» — от 4 400 ₽/м²',note:'Стартовая цена на сайте компании. Состав заказа и итоговую смету уточняйте после замера.',cta:'Получить расчёт от завода'},
 {id:oknapeople.company_id,name:'Oknapeople',url:root,image:'/images/windows-detail-1200.webp',eyebrow:'ВЫБРАТЬ. УВИДЕТЬ. ПРИМЕРИТЬ К ДОМУ.',title:'Ваши окна.\nВаш сценарий жизни.',text:'Сравните решения для тёплого дома, тихой спальни или светлой лоджии. Посмотрите образцы в шоуруме или начните с видеоконсультации.',benefits:['Бесплатный вызов замерщика','Шоурум и видеоконсультация','Установка и сервис'],offer:'Начните с бесплатного замера',note:'Условия выезда и состав расчёта подтвердит компания. Предложение по размерам вашего объекта.',cta:'Подобрать окна с Oknapeople'}
];
