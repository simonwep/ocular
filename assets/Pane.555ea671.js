import{_ as i}from"./Currency.vue_vue_type_script_setup_true_lang.dfdca35c.js";import{t as p,d as f,v as c,k as y,e as d,b as o,n as r,x as h,F as v,f as $,l as k,m as u,a as P,o as m,_}from"./index.295b5789.js";const b=(t,a,n,l=5)=>{p(()=>{var e;const s=t.value;s&&s.style.removeProperty("box-shadow"),(e=a.value)==null||e.addEventListener("scroll",()=>{s&&a.value&&(a.value.scrollTop>l?s.style.setProperty("box-shadow",n):s.style.removeProperty("box-shadow"))})})},w=o("span",null," - ",-1),S=f({__name:"Pane",props:{class:null,title:null,amount:null},setup(t){const a=t,n=c(),l=c(),s=y(()=>a.class);return b(n,l,"var(--app-scroll-box-shadow)"),(e,E)=>(m(),d("div",{class:r(e.$style.pane)},[o("div",{ref_key:"header",ref:n,class:r(e.$style.header)},[o("h1",{class:r(e.$style.title)},[o("span",null,h(t.title),1),t.amount?(m(),d(v,{key:0},[w,$(i,{value:t.amount},null,8,["value"])],64)):k("",!0)],2),u(e.$slots,"header")],2),o("div",{ref_key:"content",ref:l,class:r([e.$style.content,P(s)])},[u(e.$slots,"default")],2)],2))}}),V="S",B="T",C="U",M="V",N={pane:V,header:B,title:C,content:M},x={$style:N},z=_(S,[["__cssModules",x]]);export{z as P};
