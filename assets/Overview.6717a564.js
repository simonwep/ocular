import{_ as b,d as f,c as a,o as i,a as $,n,b as s,v as D,q as E,B as w,k as C,A as T,m,j as B,G as L,e as N,f as O,O as z,P as j}from"./index.a04044f7.js";import{A as q}from"./AsyncComponent.6957f240.js";import{t as k,a as x,s as I,b as h}from"./budgets.8c854936.js";import{_ as G}from"./Currency.11a24762.js";import{I as Q}from"./Icon.4040bbc7.js";import{L as R}from"./Link.0bac39e6.js";import{u as F,i as H,a as J,b as K,_ as U}from"./installSVGRenderer.c4b75595.js";import"./useThemeStyles.4519d0d0.js";import"./useResizeObserver.d20ebe49.js";const W="_4c";var X={summaryPanelChart:W};const Y=f({props:{class:null,color:null,values:null},setup(t){const e=t;F([H,J,K]);const c=a(()=>e.class),u=a(()=>({xAxis:{type:"category",show:!1},yAxis:{type:"value",show:!1,min:Math.min(...e.values)},grid:{top:"5%",left:"5%",bottom:"5%",right:"5%"},series:[{data:e.values,type:"line",smooth:!0,showSymbol:!1,lineStyle:{width:5,cap:"round",color:e.color}}]}));return(r,v)=>(i(),$(U,{class:n([r.$style.summaryPanelChart,s(c)]),options:s(u)},null,8,["class","options"]))}}),Z={$style:X};var ss=b(Y,[["__cssModules",Z]]);const es="_2y _2z _31 _3b",as="_30 _32",ts="_33 _34 _36 _38 _3c",ls="_35",ns="_37 _3d",os="_39",cs="_3a _3e";var rs={summaryPanel:es,editIcon:as,header:ts,head:ls,title:ns,subTitle:os,chart:cs};const us=f({props:{class:null,title:null,subTitle:null,to:null,color:null,values:null},setup(t){const e=t;D(l=>({f4e53d9a:s(v),"05e095f2":s(d),"6b024d02":s(r)}));const c=a(()=>e.class),u=a(()=>Array.isArray(e.values)?e.values[e.values.length-1]:e.values),r=a(()=>`var(${e.color}-shadow)`),v=a(()=>`var(${e.color}-light)`),d=a(()=>`var(${e.color}-light-dimmed)`),y=a(()=>e.to?R:"div");return(l,g)=>(i(),$(L(s(y)),{to:t.to,class:n([l.$style.summaryPanel,s(c)])},{default:E(()=>[t.to?(i(),$(Q,{key:0,class:n(l.$style.editIcon),icon:"pencil-fill"},null,8,["class"])):w("",!0),C("div",{class:n(l.$style.header)},[C("h2",{class:n(l.$style.head)},T(t.title),3),C("span",{class:n(l.$style.title)},[m(G,{value:s(u)},null,8,["value"])],2),t.subTitle?(i(),B("span",{key:0,class:n(l.$style.subTitle)},T(t.subTitle),3)):w("",!0)],2),Array.isArray(t.values)?(i(),$(ss,{key:1,class:n(l.$style.chart),color:s(d),values:t.values},null,8,["class","color","values"])):w("",!0)]),_:1},8,["to","class"]))}}),is={$style:rs};var _=b(us,[["__cssModules",is]]);const ms="_15 _16";var vs={summaryPanels:ms};const ds=f({props:{class:null},setup(t){const e=t,c=a(()=>e.class),{state:u}=N(),{t:r,n:v}=O(),d=a(()=>k(u.income)),y=a(()=>k(u.expenses)),l=a(()=>x(d.value)),g=a(()=>x(y.value)),p=a(()=>I(l.value,g.value)),S=a(()=>h(p.value)),M=a(()=>{const o=h(y.value),P=h(d.value);return P?o/P:0}),A=a(()=>{const o=new Date().getMonth()+1;return h(I(d.value.slice(o),y.value.slice(o)))}),V=a(()=>{const o=p.value[p.value.length-1];return o?A.value/o:0});return(o,P)=>(i(),B("div",{class:n([o.$style.summaryPanels,s(c)])},[m(_,{values:s(l),color:"--c-success",to:"/income",title:s(r)("dashboard.income")},null,8,["values","title"]),m(_,{"sub-title":s(v)(s(M),"percent"),to:"/expenses",values:s(g),color:"--c-warning",title:s(r)("dashboard.expenses")},null,8,["sub-title","values","title"]),m(_,{"sub-title":s(v)(s(S)?1-s(M):0,"percent"),values:s(p),color:"--c-primary",title:s(r)("dashboard.endingBalance")},null,8,["sub-title","values","title"]),m(_,{"sub-title":s(v)(s(V),"percent"),values:s(A),color:"--c-secondary",title:s(r)("dashboard.remainingBalance")},null,8,["sub-title","values","title"])],2))}}),ys={$style:vs};var ps=b(ds,[["__cssModules",ys]]);const hs="_8 _9 a",_s="b";var $s={overview:hs,chart:_s};const bs=f({setup(t){const e=j();return(c,u)=>(i(),B("div",{class:n(c.$style.overview)},[m(ps),m(q,{show:s(e)!=="mobile",class:n(c.$style.chart),import:()=>z(()=>import("./DistributionChart.f7964551.js"),["assets/DistributionChart.f7964551.js","assets/DistributionChart.ea83ba93.css","assets/ChartPlaceholder.fb1babdb.js","assets/ChartPlaceholder.de164889.css","assets/Icon.4040bbc7.js","assets/Icon.db2c3e40.css","assets/index.a04044f7.js","assets/index.41e40cf5.css","assets/installSVGRenderer.c4b75595.js","assets/useResizeObserver.d20ebe49.js","assets/budgets.8c854936.js"])},null,8,["show","class","import"])],2))}}),fs={$style:$s};var xs=b(bs,[["__cssModules",fs]]);export{xs as default};