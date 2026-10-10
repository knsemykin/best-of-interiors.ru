import moscow from './moscow-studios.json';
import voronezh from './voronezh-studios.json';
import spb from './spb-studios.json';
// Add published city ratings here; navigation and the city directory use this registry.
export const designCities = [
 {slug:'moskva',name:'Москва',region:'Москва и Московская область',count:moscow.studios.length,description:'Студии, авторские команды и архитектурные бюро Москвы и области.'},
 {slug:'voronezh',name:'Воронеж',region:'Воронеж и Воронежская область',count:voronezh.studios.length,description:'Местные студии, авторские команды и компании с услугой дизайна и ремонта.'},
 {slug:'sankt-peterburg',name:'Санкт-Петербург',region:'Санкт-Петербург',count:spb.studios.length,description:'Петербургские студии и авторские команды для квартир и загородных домов.'},
].map(city=>({...city,url:`/ratings/dizayn-interera/${city.slug}/`}));
