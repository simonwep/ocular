import{e as s,c as a}from"./index-5eeab8e1.js";const u=(o="long")=>{const{locale:n}=s();return a(()=>{const e=[];for(let t=0;t<12;t++)e.push(new Date(0,t).toLocaleDateString(n.value,{month:o}));return e})};export{u};