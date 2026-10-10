import {writeFile,rm,readFile,readdir} from 'node:fs/promises';
const enabled=process.env.SITE_INDEXABLE!=='false';
const urls=['/ratings/dizayn-interera/yekaterinburg/','/ratings/dizayn-interera/sankt-peterburg/','/ratings/arhitekturnye-byuro/','/ratings/arhitekturnye-byuro/moskva/chastnye-doma/','/ratings/arhitekturnye-byuro/moskva/development/','/ratings/arhitekturnye-byuro/moskva/gorodskaya-sreda/','/','/partners/','/ratings/dizayn-interera/','/ratings/dizayn-interera/moskva/','/companies/alina-salomatina/','/ratings/dizayn-interera/voronezh/'];
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n${enabled?'Sitemap: https://best-of-interiors.ru/sitemap.xml\n':'# Preview: pages carry noindex until editorial launch.\n'}`);
if(enabled)await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path=>`<url><loc>https://best-of-interiors.ru${path}</loc><lastmod>2026-10-10</lastmod></url>`).join('')}</urlset>`);
else await rm('dist/sitemap.xml',{force:true});
console.log(`Search indexing: ${enabled?'enabled; sitemap generated':'preview noindex; no sitemap'}`);

// Every new interior city must inherit the agreed default promo and lead recipient.
for(const city of await readdir('dist/ratings/dizayn-interera',{withFileTypes:true})){
 if(!city.isDirectory())continue;
 const html=await readFile(`dist/ratings/dizayn-interera/${city.name}/index.html`,'utf8');
 if(!/data-promo-recipient="(?:MSK006|VRN004)"/.test(html)||!html.includes('Alina Salomatina Interiors'))throw new Error(`Missing default design promo: ${city.name}`);
}
