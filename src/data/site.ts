// Production is indexable; SITE_INDEXABLE=false keeps preview builds private from search.
export const indexable = process.env.SITE_INDEXABLE !== 'false';
