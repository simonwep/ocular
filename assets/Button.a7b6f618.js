import{d as y,j as b,k as d,e as r,c as p,n as a,l as i,x as k,a as t,o as l,p as C,_ as h}from"./index.cb50fcad.js";import{I as B}from"./Icon.21316720.js";import{u as I}from"./useThemeStyles.4c5b6106.js";const v=y({__name:"Button",props:{class:null,iconClass:null,icon:null,text:null,color:{default:"primary"},textual:{type:Boolean,default:!1}},emits:["click"],setup(e,{emit:f}){const o=e;C(c=>({"7fcf761a":t(s).color.base,"1e11f59b":t(s).text.base,"8ba44ffe":t(s).focus,"17d61aa0":t(s).pure.base,"434b4f5a":t(s).color.hover,b6f0989c:t(s).text.hover,e2374d86:t(s).pure.hover}));const n=b(),s=I(()=>o.color),m=d(()=>[o.class,n.button,{[n.hasIcon]:o.icon,[n.textual]:o.textual,[n.iconOnly]:o.icon&&!o.text}]);return(c,u)=>(l(),r("button",{class:a(t(m)),type:"button",onClick:u[0]||(u[0]=x=>f("click",x))},[e.icon?(l(),p(B,{key:0,class:a([c.$style.icon,e.iconClass]),icon:e.icon},null,8,["class","icon"])):i("",!0),e.text?(l(),r("span",{key:1,class:a(c.$style.text)},k(e.text),3)):i("",!0)],2))}}),M="ua",O="va",$="wa",z="xa",S="ya",V="za",g={button:M,iconOnly:O,hasIcon:$,text:z,icon:S,textual:V},j={$style:g},N=h(v,[["__cssModules",j]]);export{N as B};