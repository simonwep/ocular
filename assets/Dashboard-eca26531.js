import{d as w,u as x,c as g,o as u,a as h,b as d,t as b,n as r,F as C,r as W,_ as k,e as Y,f as D,g as I,h as M,i as R,j as V,k as n,w as c,l as t}from"./index-bff5bb42.js";import{B as _}from"./Button-7c7acf0a.js";import{L as $}from"./Link-bd8d1a8d.js";import{A as L}from"./AnimatedRouterView-332f0918.js";import{P as O}from"./Pane-cc25198e.js";import"./Icon-8760e494.js";import"./useThemeStyles-128ca879.js";import"./Currency-f00eca8f.js";const S=w({__name:"TextWheel",props:{values:{},value:{}},setup(v){const l=v;x(e=>({"47c68fd3":o.value}));const o=g(()=>l.values.indexOf(l.value));return(e,p)=>(u(),h("span",{class:r(e.$style.container)},[d("span",{class:r(e.$style.placeholder)},b(e.value),3),d("span",{class:r(e.$style.textWheel)},[(u(!0),h(C,null,W(e.values,i=>(u(),h("span",{key:i,class:r(e.$style.value)},b(i),3))),128))],2)],2))}}),T="s",A="t",F="u",N="v",P={container:T,placeholder:A,textWheel:F,value:N},j={$style:P},z=k(S,[["__cssModules",j]]),E=w({__name:"Dashboard",setup(v){const{t:l}=Y(),{state:o,changeYear:e}=D(),p=I(),i=g(()=>o.years.map(a=>a.year)),y=a=>{const s=i.value,m=(s.indexOf(o.activeYear)+a+s.length)%s.length,B=s[m];e(B)};return(a,s)=>{const f=M("i18n-t");return u(),R(O,{class:r(a.$style.dashboard)},V({title:c(()=>[d("span",null,[t(f,{keypath:"dashboard.header"},{year:c(()=>[t(z,{values:i.value,value:n(o).activeYear},null,8,["values","value"])]),_:1})])]),header:c(()=>[d("div",{class:r(a.$style.viewButtons)},[t($,{tooltip:n(l)("navigation.menu.dashboard"),"tooltip-position":"bottom-end",to:"/dashboard",color:n(p).currentRoute.value.path.endsWith("/dashboard")?"primary":"dimmed",icon:"pi-chart-line"},null,8,["tooltip","color"]),t($,{tooltip:n(l)("dashboard.tableOverview"),"tooltip-position":"bottom-end",to:"/dashboard/summary",color:n(p).currentRoute.value.path.endsWith("/dashboard/summary")?"primary":"dimmed",icon:"grid-line"},null,8,["tooltip","color"])],2)]),default:c(()=>[t(L)]),_:2},[n(o).years.length>1?{name:"beforeTitle",fn:c(()=>[t(_,{icon:"arrow-left-s-line",rounded:"",onClick:s[0]||(s[0]=m=>y(-1))}),t(_,{icon:"arrow-right-s-line",rounded:"",onClick:s[1]||(s[1]=m=>y(1))})]),key:"0"}:void 0]),1032,["class"])}}}),q="b",G="c",H={dashboard:q,viewButtons:G},J={$style:H},oe=k(E,[["__cssModules",J]]);export{oe as default};