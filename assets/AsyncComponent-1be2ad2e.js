import{d as p,I as u,c as d,J as m,a as n,i as _,n as c,q as i,F as h,p as f,o as a,b as y,_ as v}from"./index-5eeab8e1.js";const w=y("span",null,null,-1),k=[w],C=p({__name:"AsyncComponent",props:{class:{},show:{type:Boolean,default:!0},import:{}},setup(r){const s=r,o=u(),t=d(()=>s.class);let l=!1;return m(()=>{s.show&&!l&&(l=!0,s.import().then(e=>o.value=e.default))}),(e,M)=>e.show?(a(),n(h,{key:0},[o.value?(a(),_(i(o.value),{key:0,class:c(t.value)},null,8,["class"])):(a(),n("div",{key:1,class:c([e.$style.placeholder,t.value])},k,2))],64)):f("",!0)}}),B="Z",A="__",g="a_",E={placeholder:B,loader:A,wrapper:g},F={$style:E},V=v(C,[["__cssModules",F]]);export{V as A};