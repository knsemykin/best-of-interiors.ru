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
export function geographicCost(position:number,includeMoscow:boolean,regionalCities:number,months:number){
 if(!Number.isInteger(position)||position<0||position>2||!Number.isInteger(regionalCities)||regionalCities<0)throw new Error('Invalid placement');
 const bonus=includeMoscow&&position===0;
 const regionalRate=partnerPrices.region[position]*(bonus?.5:1);
 const base=(includeMoscow?partnerPrices.moscow[position]:0)+regionalCities*regionalRate;
 const cost=placementCost(base,months);
 const bonusSaving=regionalCities*(partnerPrices.region[position]-regionalRate)*months;
 return {...cost,base,bonus,regionalRate,bonusSaving,totalSaving:cost.saving+bonusSaving};
}
