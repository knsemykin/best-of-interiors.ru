import {writeFile,rm} from 'node:fs/promises';
const enabled=process.env.SITE_INDEXABLE!=='false';
const urls=['/','/partners/','/ratings/dizayn-interera/','/ratings/dizayn-interera/moskva/','/companies/alina-salomatina/','/ratings/dizayn-interera/voronezh/'];
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n${enabled?'Sitemap: https://best-of-interiors.ru/sitemap.xml\n':'# Preview: pages carry noindex until editorial launch.\n'}`);
if(enabled)await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path=>`<url><loc>https://best-of-interiors.ru${path}</loc><lastmod>2026-10-09</lastmod></url>`).join('')}</urlset>`);
else await rm('dist/sitemap.xml',{force:true});
console.log(`Search indexing: ${enabled?'enabled; sitemap generated':'preview noindex; no sitemap'}`);
