import moscow from './moscow-studios.json';
import voronezh from './voronezh-studios.json';
import spb from './spb-studios.json';
import ekb from './yekaterinburg-studios.json';
import kazan from './kazan-studios.json';
import nn from './nizhny-novgorod-studios.json';
import chelyabinsk from './chelyabinsk-studios.json';
import rostov from './rostov-na-donu-studios.json';
import krasnodar from './krasnodar-studios.json';
// Add published city ratings here; navigation and the city directory use this registry.
export const designCities = [
 {slug:'moskva',name:'Москва',region:'Москва и Московская область',count:moscow.studios.length,description:'Студии, авторские команды и архитектурные бюро Москвы и области.'},
 {slug:'voronezh',name:'Воронеж',region:'Воронеж и Воронежская область',count:voronezh.studios.length,description:'Местные студии, авторские команды и компании с услугой дизайна и ремонта.'},
 {slug:'sankt-peterburg',name:'Санкт-Петербург',region:'Санкт-Петербург',count:spb.studios.length,description:'Петербургские студии и авторские команды для квартир и загородных домов.'},
 {slug:'yekaterinburg',name:'Екатеринбург',region:'Екатеринбург',count:ekb.studios.length,description:'20 местных студий и авторских команд: квартиры, дома, рабочие чертежи и сопровождение.'},
 {slug:'kazan',name:'Казань',region:'Казань',count:kazan.studios.length,description:'Местные студии и авторские команды: состав проекта, цены, комплектация и ремонт.'},
 {slug:'nizhny-novgorod',name:'Нижний Новгород',region:'Нижний Новгород',count:nn.studios.length,description:'Нижегородские студии и авторские команды: жилые проекты, цены, услуги и сопровождение ремонта.'},
 {slug:'chelyabinsk',name:'Челябинск',region:'Челябинск',count:chelyabinsk.studios.length,description:'Челябинские команды для квартир и домов: проектирование, комплектация, надзор и реализация.'},
 {slug:'rostov-na-donu',name:'Ростов-на-Дону',region:'Ростов-на-Дону',count:rostov.studios.length,description:'Ростовские студии и авторские команды: проекты квартир и домов, цены, комплектация и реализация.'},
 {slug:'krasnodar',name:'Краснодар',region:'Краснодар',count:krasnodar.studios.length,description:'Краснодарские студии для квартир и домов: проекты, цены, комплектация и сопровождение.'},
].map(city=>({...city,url:`/ratings/dizayn-interera/${city.slug}/`}));
