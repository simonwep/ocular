import{d,u as f,k as n,a5 as k,y as _,c as y,h as v,Y as h,Z as C,o as a,i as c,w as L,n as l,p as S,E as b,_ as w}from"./index-5eeab8e1.js";import{I as B}from"./Icon-90130150.js";import{u as M}from"./useThemeStyles-29b3f507.js";const $=d({__name:"Link",props:{class:{},icon:{},color:{default:"primary"},custom:{type:Boolean,default:void 0},tooltip:{},tooltipPosition:{},to:{}},setup(i){const s=i;f(o=>({"5a8aab04":n(e).pure.base,"11b4a92e":n(e).pure.hover}));const r=k(),t=_(),u=y(()=>[s.class,t.link,{[t.custom]:s.custom??r.default}]),e=M(()=>s.color);return(o,V)=>{const p=v("RouterLink"),m=h("tooltip");return C((a(),c(p,{to:o.to,class:l(u.value)},{default:L(()=>[o.icon?(a(),c(B,{key:0,class:l(o.$style.icon),icon:o.icon},null,8,["class","icon"])):S("",!0),b(o.$slots,"default")]),_:3},8,["to","class"])),[[m,{text:o.tooltip,position:o.tooltipPosition}]])}}}),D="S",I="T",P="U",R={link:D,icon:I,custom:P},T={$style:R},U=w($,[["__cssModules",T]]);export{U as L};