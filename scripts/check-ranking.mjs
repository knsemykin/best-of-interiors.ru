import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
const research=JSON.parse(await readFile('src/data/moscow-studios.json','utf8'));
const html=await readFile('dist/ratings/dizayn-interera/moskva/index.html','utf8');
assert.equal(research.studios.length,175);
assert.equal(new Set(research.studios.map(s=>s.studio_id)).size,175);
for(const s of research.studios){
 assert.equal(s.criteria.reduce((sum,c,i)=>sum+c*research.weights[i],0),s.score,`${s.name}: score`);
 assert.equal(1+research.studios.filter(o=>o.segment===s.segment&&o.score>s.score).length,s.rank,`${s.name}: rank`);
 assert.ok(html.includes(`id="${s.studio_id}"`));
}
assert.equal((html.match(/data-studio /g)||[]).length,175);
assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
assert.equal((html.match(/class="promo-badge"/g)||[]).length,3);
assert.ok(!html.includes('AggregateRating'));
assert.ok(!html.includes('href="tel:'));
assert.ok(html.includes('<form id="lead-form" method="dialog"'));
const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
const lists=schema['@graph'].filter(x=>x['@type']==='ItemList');
assert.deepEqual(lists.map(x=>x.numberOfItems),[164,11]);
const enabled=process.env.SITE_INDEXABLE==='true';
assert.equal(html.includes('content="index, follow, max-image-preview:large"'),enabled);
if(enabled){const sitemap=await readFile('dist/sitemap.xml','utf8');assert.ok(sitemap.includes('/ratings/dizayn-interera/moskva/'));assert.ok(!sitemap.includes('/privacy/'));}
else {let exists=true;try{await access('dist/sitemap.xml');}catch{exists=false;}assert.equal(exists,false);}
console.log(`PASS: 175 scores/ranks, source anchors, 3 promo cards, H1, schema, non-clickable phones, preview form, ${enabled?'production':'preview'} indexing. HTML gzip: ${gzipSync(html).length} bytes.`);
const updates=JSON.parse(await readFile('src/data/editorial-updates.json','utf8'));
const edited=research.studios.map(s=>({...s,...updates[s.studio_id]}));
for(const s of edited)s.score=s.criteria.reduce((sum,n,i)=>sum+n*research.weights[i],0);
const home=edited.filter(s=>s.segment==='Жилые интерьеры').sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'ru'));
assert.equal(home[1].studio_id,'MSK006');assert.equal(home[1].score,90);assert.ok(home[1].draft_review);
const numbers=[...html.matchAll(/class="rank-number"[^>]*>(\d+)</g)].map(m=>Number(m[1]));
assert.deepEqual(numbers,Array.from({length:175},(_,i)=>i+1));
assert.ok(html.includes('ТОП-175 лучших'));assert.ok(!html.includes('0</b> платных баллов'));
assert.ok(!html.includes('id="pagination"'));assert.ok(html.includes('id="load-more"'));
const portfolios=JSON.parse(await readFile('src/data/promo-portfolios.json','utf8'));
assert.equal(portfolios.length,3);
for(const p of portfolios){assert.equal(p.works.length,5);const company=await readFile(`dist/companies/${p.slug}/index.html`,'utf8');assert.ok(company.includes('noindex, follow'));for(const w of p.works){await access('public'+w.image);assert.ok(company.includes(w.title));}}
assert.equal((html.match(/class="portfolio-card-link"/g)||[]).length,3);
console.log('PASS: sequential 1–175 numbering, draft Alina position 2 / 90 points, three portfolio pages, 15 assets, progressive-list markup.');
