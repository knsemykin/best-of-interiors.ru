export const partnerPrices = {moscow:[40000,35000,30000],region:[20000,15000,10000]} as const;
export const paymentTerms = [
 {months:1,discount:0,label:'1 месяц — без скидки'},
 {months:3,discount:10,label:'3 месяца — скидка 10%'},
 {months:6,discount:15,label:'6 месяцев — скидка 15%'},
 {months:12,discount:20,label:'1 год — скидка 20%'},
] as const;
export function placementCost(base:number,months:number){
 const term=paymentTerms.find(t=>t.months===months);
 if(!term)throw new Error('Unsupported payment term');
 const monthly=Math.round(base*(100-term.discount)/100);
 return {monthly,total:monthly*months,saving:base*months-monthly*months,discount:term.discount,months};
}
