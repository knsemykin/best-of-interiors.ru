import * as moscow from './moscow';
import type {Studio} from './moscow';
export const path='/ratings/dizayn-interera/';
const better={studio_id:'RUS001',name:'Better',website:'https://better.archi/',segment:'Жилые интерьеры',entity_type:'Архитектурное бюро',office_address:null,phone:'+7 (995) 900-01-40',year_started:null,team_size_declared:null,design_rub_m2_from:null,design_currency:'RUB',styles_mentioned:null,services:'Архитектура; Дизайн интерьера; Рабочее проектирование; Авторское сопровождение; Комплектация; Декорирование',author_supervision:'Заявлено',procurement:'Заявлено',working_drawings:'Заявлено',renovation_service:null,criteria:[0,0,0,0,0,0,0,0,0,0],score:0,rank:9,description_short:'Архитектурное бюро с проектами частных резиденций, вилл и интерьеров. Предлагает разработку концепции, рабочие чертежи и сопровождение реализации.',description_long:'Better объединяет архитектурное проектирование и дизайн интерьера. На официальном сайте представлены вилла в Абу-Даби, дом в Репино и частные резиденции. Бюро предлагает авторское сопровождение, комплектацию и декорирование. Состав проекта, географию выездов и стоимость нужно согласовать под конкретный объект.',realization_model:'Авторское сопровождение реализации; строительный подряд уточните отдельно',procurement_orders:'Комплектация заявлена; объём закупок и логистики уточните',price_notes:'Стоимость рассчитывается индивидуально; сопоставимый публичный тариф не установлен.'} as unknown as Studio;
const selection=[
 ['MSK005','Авторские интерьеры и инженерная проработка.'],
 ['MSK001','Дизайн интерьера, архитектура и комплексное ведение проекта.'],
 ['MSK004','Архитектура и интерьеры с сопровождением реализации.'],
 ['MSK006','Индивидуальные интерьеры, комплектация и реализация проекта.'],
 ['MSK057','Проектирование, комплектация и ремонт в составе предложения студии.'],
 ['MSK039','Собственное мебельное производство и VR-визуализация в предложении студии.'],
 ['MSK199','Интерьеры с инженерными разделами и сопровождением.'],
 ['MSK127','Премиальные интерьеры, декорирование и комплектация.'],
 ['RUS001','Архитектура и интерьеры частных резиденций и вилл.'],
 ['MSK129','Крупные частные дома, архитектура и управление реализацией.'],
] as const;
export const studios=selection.map(([id,reason],i)=>{const s=id==='RUS001'?better:moscow.studios.find(s=>s.studio_id===id);if(!s)throw Error('Missing editorial selection '+id);return {...s,kind:'studio',city:'Выбор редакции',reason,sourcePath:id==='RUS001'?null:moscow.path,listPosition:i+1};});
export const residential=studios;
export const commercial=[];
export const commercialStudios=[];
export const evidence=[...moscow.evidence.filter(e=>selection.some(([id])=>id===e.studio_id)),{studio_id:'RUS001',field:'services',source_url:'https://better.archi/',checked_at:'2026-10-10',status:'Официальный сайт: услуги, контакты, портфолио'}];
export const projects=moscow.projects.filter(p=>selection.some(([id])=>id===p.studio_id));
export const criteria=moscow.criteria;
export {price} from './moscow';
