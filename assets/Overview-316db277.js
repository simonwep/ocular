import{d as P,i as a,o as r,c as y,n as l,_ as C,j as L,k as N,g as w,w as O,l as b,f as T,t as D,h as d,m as x,p as z,a as j,u as F,q as Q,s as R,e as t,v as W,x as X}from"./index-c7de6a90.js";import{A as G}from"./AsyncComponent-0cf7e9d1.js";import{t as I}from"./budgets-531db56b.js";import{a as V,s as Y,b as f}from"./array-1d6fe4d9.js";import{C as H}from"./Currency-06dcbebd.js";import{I as J}from"./Icon-98f761c9.js";import{L as K}from"./Link-b00b7d30.js";import{u as U,i as Z,a as ee,b as se,_ as ae}from"./EChart.vue_vue_type_script_setup_true_lang-d47a8e51.js";import"./useThemeStyles-d9df6cd3.js";import"./useResizeObserver-5455fc32.js";const te=P({__name:"SummaryPanelChart",props:{class:{},color:{},values:{}},setup(i){const s=i;U([Z,ee,se]);const o=a(()=>s.class),n=a(()=>({xAxis:{type:"category",show:!1},yAxis:{type:"value",show:!1,min:Math.min(...s.values)},grid:{top:"5%",left:"5%",bottom:"5%",right:"5%"},series:[{data:s.values,type:"line",smooth:!0,showSymbol:!1,lineStyle:{width:5,cap:"round",color:s.color}}]}));return(c,m)=>(r(),y(ae,{class:l([c.$style.summaryPanelChart,o.value]),options:n.value},null,8,["class","options"]))}}),le="w_",oe={summaryPanelChart:le},ne={$style:oe},re=C(te,[["__cssModules",ne]]),ce=P({__name:"SummaryPanel",props:{class:{},title:{},subTitle:{},to:{},color:{},values:{}},setup(i){const s=i;L(e=>({"246684c0":h.value,cd8cef0c:v.value,"79a45c16":m.value}));const o=a(()=>s.class),n=N(.25),c=a(()=>Array.isArray(s.values)?s.values[s.values.length-1]:s.values),m=a(()=>`var(${s.color}-shadow)`),h=a(()=>`var(${s.color}-light)`),v=a(()=>`var(${s.color}-light-dimmed)`),A=a(()=>s.to?K:"div");return(e,_)=>(r(),w("div",{ref_key:"root",ref:n,style:z(e.$style.wrapper)},[(r(),y(x(A.value),{to:e.to,class:l([e.$style.summaryPanel,o.value])},{default:O(()=>[e.to?(r(),y(J,{key:0,class:l(e.$style.editIcon),icon:"pencil-fill"},null,8,["class"])):b("",!0),T("div",{class:l(e.$style.header)},[T("h2",{class:l(e.$style.head)},D(e.title),3),d(H,{class:l(e.$style.title),value:c.value},null,8,["class","value"]),e.subTitle?(r(),w("span",{key:0,class:l(e.$style.subTitle)},D(e.subTitle),3)):b("",!0)],2),Array.isArray(e.values)?(r(),y(re,{key:1,class:l(e.$style.chart),color:v.value,values:e.values},null,8,["class","color","values"])):b("",!0)]),_:1},8,["to","class"]))],4))}}),ue="o_",ie="p_",me="q_",ve="r_",de="s_",pe="t_",ye="u_",he="v_",_e={wrapper:ue,summaryPanel:ie,editIcon:me,header:ve,head:de,title:pe,subTitle:ye,chart:he},$e={$style:_e},g=C(ce,[["__cssModules",$e]]),fe=P({__name:"SummaryPanels",props:{class:{}},setup(i){const s=i,o=new Date().getFullYear(),{state:n}=j(),{t:c,n:m}=F(),h=Q(0),v=R(),A=a(()=>[s.class,v.summaryPanels,{[v.reduced]:n.activeYear!==o,[v.unAnimated]:h.value>=3}]),e=a(()=>I(n.income)),_=a(()=>I(n.expenses)),M=a(()=>V(e.value)),S=a(()=>V(_.value)),$=a(()=>Y(M.value,S.value)),q=a(()=>f($.value)),k=a(()=>{const u=f(_.value),p=f(e.value);return p?u/p:0}),B=a(()=>{const u=new Date().getMonth()+1;return f(Y(e.value.slice(u),_.value.slice(u)))}),E=a(()=>{const u=$.value[$.value.length-1];return u?B.value/u:0});return(u,p)=>(r(),w("div",{class:l(A.value),onAnimationend:p[0]||(p[0]=De=>h.value++)},[d(g,{values:M.value,color:"--c-success",to:"/income",title:t(c)("dashboard.income")},null,8,["values","title"]),d(g,{"sub-title":t(m)(k.value,"percent"),to:"/expenses",values:S.value,color:"--c-warning",title:t(c)("dashboard.expenses")},null,8,["sub-title","values","title"]),d(g,{"sub-title":t(m)(q.value?1-k.value:0,"percent"),values:$.value,color:"--c-primary",title:t(c)("dashboard.endingBalance")},null,8,["sub-title","values","title"]),t(o)===t(n).activeYear?(r(),y(g,{key:0,"sub-title":t(m)(E.value,"percent"),values:B.value,color:"--c-secondary",title:t(c)("dashboard.remainingBalance",{year:t(o)+1})},null,8,["sub-title","values","title"])):b("",!0)],34))}}),ge="W",be="X",we="Y",Pe={summaryPanels:ge,reduced:be,unAnimated:we},Ce={$style:Pe},Ae=C(fe,[["__cssModules",Ce]]),Me=P({__name:"Overview",setup(i){const s=X();return(o,n)=>(r(),w("div",{class:l(o.$style.overview)},[d(Ae),d(G,{show:t(s)!=="mobile",class:l(o.$style.chart),import:()=>W(()=>import("./DistributionChart-23f6a2c9.js"),["assets/DistributionChart-23f6a2c9.js","assets/index-c7de6a90.js","assets/index-5ff5891b.css","assets/ChartPlaceholder-dbf7fec6.js","assets/Icon-98f761c9.js","assets/Icon-1f5fe91c.css","assets/ChartPlaceholder-025175d7.css","assets/EChart.vue_vue_type_script_setup_true_lang-d47a8e51.js","assets/useResizeObserver-5455fc32.js","assets/budgets-531db56b.js","assets/array-1d6fe4d9.js","assets/DistributionChart-fa68a610.css"])},null,8,["show","class","import"])],2))}}),Se="d",ke="e",Be={overview:Se,chart:ke},Te={$style:Be},je=C(Me,[["__cssModules",Te]]);export{je as default};
