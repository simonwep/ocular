import{d,u as f,k as n,a7 as k,y as _,c as y,h as v,$ as h,a0 as C,o as a,i as c,w as L,n as l,p as $,E as b,_ as w}from"./index-bff5bb42.js";import{I as B}from"./Icon-8760e494.js";import{u as M}from"./useThemeStyles-128ca879.js";const S=d({__name:"Link",props:{class:{},icon:{},color:{default:"primary"},custom:{type:Boolean,default:void 0},tooltip:{},tooltipPosition:{},to:{}},setup(i){const s=i;f(o=>({"5a8aab04":n(e).pure.base,"11b4a92e":n(e).pure.hover}));const r=k(),t=_(),u=y(()=>[s.class,t.link,{[t.custom]:s.custom??r.default}]),e=M(()=>s.color);return(o,q)=>{const p=v("RouterLink"),m=h("tooltip");return C((a(),c(p,{to:o.to,class:l(u.value)},{default:L(()=>[o.icon?(a(),c(B,{key:0,class:l(o.$style.icon),icon:o.icon},null,8,["class","icon"])):$("",!0),b(o.$slots,"default")]),_:3},8,["to","class"])),[[m,{text:o.tooltip,position:o.tooltipPosition}]])}}}),D="p",I="q",P="r",R={link:D,icon:I,custom:P},V={$style:R},T=w(S,[["__cssModules",V]]);export{T as L};