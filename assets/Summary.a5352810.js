import{_ as S,d as w,o as a,f as r,e as n,v as l,n as e,p as V,u as T,k as _,c as C,w as z,r as f,b as s,F as h,z as F,g as M,A as L,B as P}from"./index.27b640a2.js";import{A as q}from"./AsyncComponent.13629399.js";import{f as G,b as k,c as g,s as I,a as O,t as D}from"./budgets.8c854936.js";import{u as E}from"./useMonthNames.19812fcb.js";const Q="_2v",R="_2w",j="_2x";var H={summaryTable:Q,title:R,table:j};const J=w({props:{title:null},setup(d){return(m,i)=>(a(),r("div",{class:e(m.$style.summaryTable)},[n("h1",{class:e(m.$style.title)},l(d.title),3),n("div",{class:e(m.$style.table)},[V(m.$slots,"default")],2)],2))}}),K={$style:H};var N=S(J,[["__cssModules",K]]);const U="_1l _1m _1n _1p _1r _1t _1v _1y _21",W="_1o",X="_1q",Y="_1s",Z="_1u _1w _1z",x="_1x",ss="_20";var es={table:U,bold:W,muted:X,currentMonth:Y,current:Z,first:x,last:ss};const ts=n("span",null,null,-1),ls=w({props:{class:null,groups:null,title:null},setup(d){const m=d,{t:i,n:o}=T(),v=E(),$=new Date().getMonth(),p=_(()=>G(m.groups));return(u,t)=>(a(),C(N,{title:d.title},{default:z(()=>[n("div",{class:e(u.$style.table)},[ts,(a(!0),r(h,null,f(s(v),(b,c)=>(a(),r("span",{class:e([u.$style.bold,{[u.$style.currentMonth]:c===s($)}]),key:b},l(b),3))),128)),n("span",{class:e(u.$style.bold)},l(s(i)("budget.total")),3),n("span",{class:e(u.$style.bold)},l(s(i)("budget.average")),3),(a(!0),r(h,null,f(s(p),(b,c)=>(a(),r(h,{key:b.id},[n("span",{class:e(u.$style.bold)},l(b.name),3),(a(!0),r(h,null,f(b.totals,(y,B)=>(a(),r("span",{class:e({[u.$style.current]:B===s($),[u.$style.first]:c===0,[u.$style.last]:c===s(p).length-1}),key:B},l(s(o)(y,"currency")),3))),128)),n("span",{class:e(u.$style.bold)},l(s(o)(s(k)(b.totals),"currency")),3),n("span",{class:e(u.$style.bold)},l(s(o)(s(g)(b.totals),"currency")),3)],64))),128))],2)]),_:1},8,["title"]))}}),ns={$style:es};var A=S(ls,[["__cssModules",ns]]);const as="_22 _23 _24 _26 _28 _2a _2c _2f _2i",rs="_25",os="_27",us="_29",cs="_2b _2d _2g",ys="_2e",ds="_2h";var ms={table:as,bold:rs,muted:os,currentMonth:us,current:cs,first:ys,last:ds};const is=n("span",null,null,-1),$s=n("span",null,null,-1),ps=w({props:{income:{default:()=>[]},expenses:{default:()=>[]},title:null},setup(d){const m=d,{t:i,n:o}=T(),v=E(),$=new Date().getMonth(),p=_(()=>I(m.income,m.expenses)),u=_(()=>O(p.value));return(t,b)=>(a(),C(N,{title:d.title},{default:z(()=>[n("div",{class:e(t.$style.table)},[is,(a(!0),r(h,null,f(s(v),(c,y)=>(a(),r("span",{class:e([t.$style.bold,{[t.$style.currentMonth]:y===s($)}]),key:c},l(c),3))),128)),n("span",{class:e(t.$style.bold)},l(s(i)("budget.total")),3),n("span",{class:e(t.$style.bold)},l(s(i)("budget.average")),3),n("span",{class:e([t.$style.bold,t.$style.muted])},l(s(i)("dashboard.income")),3),(a(!0),r(h,null,f(d.income,(c,y)=>(a(),r("span",{class:e([t.$style.muted,t.$style.first,{[t.$style.current]:y===s($)}]),key:y},l(s(o)(c,"currency")),3))),128)),n("span",{class:e(t.$style.muted)},l(s(o)(s(k)(d.income),"currency")),3),n("span",{class:e(t.$style.muted)},l(s(o)(s(g)(d.income),"currency")),3),n("span",{class:e([t.$style.bold,t.$style.muted])},l(s(i)("dashboard.expenses")),3),(a(!0),r(h,null,f(d.expenses,(c,y)=>(a(),r("span",{class:e([t.$style.muted,{[t.$style.current]:y===s($)}]),key:y},l(s(o)(c,"currency")),3))),128)),n("span",{class:e(t.$style.muted)},l(s(o)(s(k)(d.expenses),"currency")),3),n("span",{class:e(t.$style.muted)},l(s(o)(s(g)(d.expenses),"currency")),3),n("span",{class:e([t.$style.bold,t.$style.muted])},l(s(i)("dashboard.netSavings")),3),(a(!0),r(h,null,f(s(p),(c,y)=>(a(),r("span",{class:e([t.$style.muted,{[t.$style.current]:y===s($)}]),key:y},l(s(o)(c,"currency")),3))),128)),n("span",{class:e(t.$style.muted)},l(s(o)(s(k)(s(p)),"currency")),3),n("span",{class:e(t.$style.muted)},l(s(o)(s(g)(s(p)),"currency")),3),n("span",{class:e(t.$style.bold)},l(s(i)("dashboard.endingBalance")),3),(a(!0),r(h,null,f(s(u),(c,y)=>(a(),r("span",{class:e([t.$style.bold,t.$style.last,{[t.$style.current]:y===s($)}]),key:y},l(s(o)(c,"currency")),3))),128)),$s,n("span",{class:e(t.$style.bold)},l(s(o)(s(g)(s(u)),"currency")),3)],2)]),_:1},8,["title"]))}}),bs={$style:ms};var hs=S(ps,[["__cssModules",bs]]);const fs="_6",vs="_7";var gs={summary:fs,chart:vs};const _s=w({setup(d){const{state:m}=F(),{t:i}=T(),o=P(),v=_(()=>D(m.income)),$=_(()=>D(m.expenses));return(p,u)=>(a(),r("div",{class:e(p.$style.summary)},[M(q,{show:s(o)!=="mobile",class:e(p.$style.chart),import:()=>L(()=>import("./DevelopmentChart.eb82d3b0.js"),["assets/DevelopmentChart.eb82d3b0.js","assets/DevelopmentChart.fc0785c4.css","assets/ChartPlaceholder.7cfaf4a0.js","assets/ChartPlaceholder.a594cd47.css","assets/Icon.16e20304.js","assets/Icon.174105fb.css","assets/index.27b640a2.js","assets/index.41e40cf5.css","assets/installSVGRenderer.b0bd8de7.js","assets/installSVGRenderer.de2d4094.css","assets/useResizeObserver.c4846113.js","assets/useMonthNames.19812fcb.js","assets/budgets.8c854936.js"])},null,8,["show","class","import"]),M(hs,{title:s(i)("dashboard.summary"),income:s(v),expenses:s($)},null,8,["title","income","expenses"]),M(A,{title:s(i)("dashboard.income"),groups:s(m).income},null,8,["title","groups"]),M(A,{title:s(i)("dashboard.expenses"),groups:s(m).expenses},null,8,["title","groups"])],2))}}),Ms={$style:gs};var Bs=S(_s,[["__cssModules",Ms]]);export{Bs as default};
