(function(root){
'use strict';
const cents=n=>Math.round(Number(n||0)*100),money=n=>n/100;
const total=xs=>money(xs.reduce((s,x)=>s+cents(x.amount),0));
const subs=[];
const defaults={"schemaVersion":2,"balance":0,"balanceDate":"2026-10-15","salary":0,"salaryDate":"2026-11-07","periodStart":"2026-10-15","periodEnd":"2026-11-15","limit":0,"reserve":0,"rent":0,"rentDate":"2026-10-16","loan":0,"loanDate":"2026-10-18","loanActive":false,"ashrai":0,"statementTotal":0,"statementDate":"2026-11-15","statementStatus":"Частичная выписка","cibusDays":0,"cibus50":0,"cibusOrdinary":0,"cibusLunchShare":0,"cibusIncluded":false,"childSupport":0,"math":0,"hebrewOffset":0,"childDate":"2026-11-01","subs":[],"installments":[],"extra":[],"holidays":[],"planned":[],"purchases":[],"audit_log":[],"open":{"cibus":false,"child":true,"subs":false,"installments":false,"holidays":false,"planned":false,"purchases":true,"report":false,"forecast":true,"reconciliation":false,"chart":false},"history":[],"selectedPeriods":[],"previousSpending":0,"savingGoal":0,"comparedSpending":0,"carry":0,"salaryStep":0,"childName":"ребёнок","reconciliation_notes":"","cardId":"main","initial_parameters":{"salary":0,"limit":0,"hebrewOffset":0}};
function migrate(raw={}){let d={...structuredClone(defaults),...raw,open:{...defaults.open,...raw.open}};if(raw.schemaVersion!==2){d.legacy_snapshot=structuredClone(raw);if(!raw.subs||raw.subs.length===1&&/уточнить состав/.test(raw.subs[0].name))d.subs=structuredClone(subs);d.cibusLunchShare=17;d.schemaVersion=2;d.salaryStep=0;}return d;}
const inPeriod=(d,date)=>!!date&&date>=d.periodStart&&date<=d.periodEnd;
const future=(d,date)=>inPeriod(d,date)&&date>d.balanceDate;
function cibus(d){const days=Math.max(0,Math.trunc(d.cibusDays)),n50=Math.min(days,Math.max(0,Math.trunc(d.cibus50))),ordinary=Math.min(days-n50,Math.max(0,Math.trunc(d.cibusOrdinary)));return{days,n50,ordinary,n40:days-n50-ordinary,amount:money((days-n50-ordinary)*200+n50*1200+ordinary*cents(d.cibusLunchShare))};}
const child=d=>money(cents(d.childSupport)+cents(d.math)-cents(d.hebrewOffset)+cents(total(d.extra)));
const remaining=x=>money(Math.max(0,x.payment_count-x.payment_index)*cents(x.amount_per_payment));
function excluded(x){return x.is_test===true||x.date==='2026-10-10'&&cents(x.amount)===100;}
function unique(xs){const seen=new Set;return xs.filter(x=>{const key=x.external_id||x.id;if(key&&seen.has(key))return false;if(key)seen.add(key);return !excluded(x)});}
function chargeDate(x,d){if(x.expected_charge_date)return x.expected_charge_date;if(x.charge_date)return x.charge_date;if(x.method==='Счёт')return x.date;let date=x.date||d.periodStart;let year=+date.slice(0,4),month=+date.slice(5,7);if(+date.slice(8,10)>=15){if(++month>12){year++;month=1}}return `${year}-${String(month).padStart(2,'0')}-15`;}
function purchaseCost(d,x){if(excluded(x)||!future(d,chargeDate(x,d)))return false;if(x.method==='Счёт')return true;const linked=d.installments.find(i=>i.id===x.installment_id&&i.active)||d.subs.find(i=>i.id===x.recurring_id);return !(linked&&linked.included_in_statement)&&!['Списано со счёта','Включено в выписку'].includes(x.status)&&!x.included_in_statement;}

function ledger(d){const rows=[];const add=(name,amount,source,method,date,included,status,kind,operation_date='Не подтверждена')=>rows.push({name,amount,source,method,date,included,status,kind,operation_date});
add('Ашрай октября',d.ashrai,'Прежняя выписка; баланс после списания','Ашрай','2026-10-15',true,'Не вычитать повторно','history');
add('Ашрай ноября · сумма выписки',d.statementTotal,'1000227264.jpg / редактируемая выписка','Ашрай',d.statementDate,!future(d,d.statementDate),d.statementStatus,'statement');
for(const [name,key,date]of [['Аренда','rent',d.rentDate],['Последний кредит','loan',d.loanDate]])if(key!=='loan'||d.loanActive)add(name,d[key],'PROJECT_HISTORY_AND_SPEC.md','Счёт',date,!future(d,date),key==='loan'?'Последний платёж':'Прогноз даты','direct');
add('Алименты и ребёнок',child(d),'Алименты + обязательные и дополнительные расходы − компенсация','Счёт',d.childDate,!future(d,d.childDate),'Прогноз','direct');
add('Cibus',cibus(d).amount,'Расчёт рабочих дней','Ашрай',d.statementDate,d.cibusIncluded||!future(d,d.statementDate),'Прогноз','component');
for(const x of d.subs){const matched=unique(d.purchases).some(p=>p.recurring_id===x.id);const date=x.expected_charge_date||d.statementDate;add(x.name,x.amount,x.source||'Ручной ввод',x.method||'Ашрай',date,!!x.included_in_statement||matched||!future(d,date),x.status||'Прогноз','component','Ориентировочно '+(x.day||'—')+'-е');}
for(const x of d.installments)if(x.active){const matched=unique(d.purchases).some(p=>p.installment_id===x.id||x.transaction_id===p.id);add(x.merchant,x.amount_per_payment,x.source,'Ашрай',x.expected_charge_date,!!x.included_in_statement||matched||!future(d,x.expected_charge_date),x.status,'installment',x.purchase_date||'Не подтверждена');}
for(const x of unique(d.purchases)){const date=chargeDate(x,d);add(x.name,x.amount,x.source||'Ручной ввод',x.method,date,!purchaseCost(d,x),x.status,'purchase',x.date);}
for(const c of ['planned','holidays'])for(const x of d[c])if(!x.transaction_id||!d.purchases.some(p=>p.id===x.transaction_id))add(x.name,x.amount,'Резерв / план',x.method||'Ашрай',chargeDate(x,d),!future(d,chargeDate(x,d)),'Запланировано','reserve');
add('Резерв банковских рисков',d.reserve,'Оценка, не банковское списание','Резерв',d.periodEnd,false,'Оценка банковского риска','reserve');return rows;}
function calculate(d){const rows=ledger(d),expenses=total(rows.filter(x=>!x.included&&x.kind!=='history'));const salary=future(d,d.salaryDate)?d.salary:0;const forecast=money(cents(d.balance)+cents(salary)-cents(expenses));return{expenses,forecast,free:money(cents(forecast)-cents(d.limit)),rows};}
function saving(d){const ceiling=money(cents(d.previousSpending)-cents(d.savingGoal)-cents(d.carry)),excess=Math.max(0,money(cents(d.comparedSpending)-cents(ceiling)));return{ceiling,excess,nextGoal:money(cents(d.savingGoal)+cents(excess))};}
const api={defaults,migrate,cents,total,cibus,child,remaining,calculate,ledger,saving,unique,chargeDate,purchaseCost,inPeriod,future};if(typeof module!=='undefined')module.exports=api;root.CashModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
