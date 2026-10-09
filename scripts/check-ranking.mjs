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
