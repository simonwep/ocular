import{u as x,i as ee,a as te,b as se,_ as le}from"./EChart.vue_vue_type_script_setup_true_lang-f82b7fdc.js";import{d as A,c as B,o as g,i as U,n as u,K as ne,x as I,a as $,l as v,k as y,s as oe,b as r,t as S,p as ae,_ as P,L as Q,M as H,e as K,N as ue,O as J,P as W,y as re,f as O,B as Y,G as z,F as w,r as E,w as j}from"./index-bff5bb42.js";import{t as ce}from"./budgets-531db56b.js";import{P as de}from"./Pane-cc25198e.js";import{B as R}from"./Button-7c7acf0a.js";import{C as F}from"./Currency-f00eca8f.js";import{u as pe}from"./useMonthNames-713ca91d.js";const ie=A({__name:"MiniChart",props:{class:{},values:{}},setup(_){const h=_;x([ee,te,se]);const s=B(()=>h.class),d=B(()=>({xAxis:{type:"category",show:!1},yAxis:{show:!1,min:Math.min(...h.values)},grid:{top:"15%",left:0,bottom:"20%",right:0},series:[{data:h.values,type:"line",smooth:!0,showSymbol:!1,silent:!0}]}));return(p,i)=>(g(),U(le,{class:u(s.value),options:d.value},null,8,["class","options"]))}}),o=ne({group:void 0,source:void 0,target:void 0,type:void 0}),me=A({__name:"Draggable",props:{text:{type:Function},name:{},id:{}},emits:["drop"],setup(_,{emit:h}){const s=_,d=I(),p=I(),i=I(0),C=I(0),k=B(()=>s.id===o.target&&o.type),N=B(()=>k.value?o.type==="before"?"skip-up-line":"skip-down-line":"draggable"),G=B(()=>{var t;return o.target&&o.target&&o.source?(t=s.text)==null?void 0:t.call(s,o):void 0}),D=t=>{t.dataTransfer&&p.value&&(o.group=s.name,o.source=s.id,t.dataTransfer.effectAllowed="move",t.dataTransfer.setDragImage(p.value,1/0,1/0),t.dataTransfer.setData("text/plain",s.name))},a=t=>{i.value=t.pageX,C.value=t.pageY},c=t=>{var e;if(o.group===s.name){const f=(e=d.value)==null?void 0:e.getBoundingClientRect();if(t.preventDefault(),f&&s.id!==o.source){const n=t.pageY<f.top+f.height/2?"before":"after";o.target=s.id,o.type=n}}},l=t=>{t.pageX&&t.pageY&&o.target!==s.id&&(o.type=void 0,o.target=void 0)},b=()=>{o.type=void 0,o.target=void 0,o.source=void 0,o.group=void 0},m=t=>{o.target&&o.target&&o.source&&h("drop",o),t.preventDefault()};return(t,e)=>(g(),$("div",{ref_key:"draggable",ref:d,class:u(t.$style.draggable),draggable:"true",onDragend:b,onDragover:c,onDragleave:l,onDrop:m,onDrag:a,onDragstart:D},[v(R,{color:y(o).group===s.name?"primary":"dimmed",icon:N.value,textual:""},null,8,["color","icon"]),y(o).source===s.id&&C.value&&i.value&&G.value?(g(),$("div",{key:0,style:oe({top:`${C.value+5}px`,left:`${i.value+5}px`}),class:u(t.$style.content)},[r("span",{class:u(t.$style.text)},S(G.value),3)],6)):ae("",!0),r("div",{ref_key:"element",ref:p,class:u(t.$style.hidden)},"hidden",2)],34))}}),ge="O_",ve="P_",ye="Q_",fe="R_",$e={draggable:ge,content:ve,text:ye,hidden:fe},be={$style:$e},Z=P(me,[["__cssModules",be]]),_e=["type","value"],he=A({__name:"CurrencyCell",props:Q({max:{default:Number.MAX_SAFE_INTEGER}},{modelValue:{}}),emits:["update:modelValue"],setup(_){const h=_,s=H(_,"modelValue"),d=I(),p=I(!1),{n:i}=K(),C=B(()=>p.value||!s.value?s.value||"":i(s.value,"currency")),k=a=>{const c=Number((a==null?void 0:a.trim())||NaN);s.value=Number.isNaN(c)?0:c},N=a=>{a.key==="-"&&a.preventDefault()},G=()=>{p.value=!0,W(()=>d.value.select())},D=a=>k(a.target.value);return ue(()=>s.value,(a,c)=>{(a??0)>h.max&&c!==void 0&&(s.value=c)}),(a,c)=>(g(),$("input",{ref_key:"input",ref:d,class:u(a.$style.currencyCell),type:p.value?"number":"text",value:C.value,onBlur:c[0]||(c[0]=l=>p.value=!1),onFocus:G,onInput:D,onKeydown:[N,c[1]||(c[1]=J(l=>{var b;return(b=d.value)==null?void 0:b.blur()},["enter"]))]},null,42,_e))}}),Ce="wb",Be={currencyCell:Ce},ke={$style:Be},Me=P(he,[["__cssModules",ke]]),Ge=["value"],De=A({__name:"TextCell",props:Q({inline:{type:Boolean,default:!1}},{modelValue:{}}),emits:["update:modelValue"],setup(_){const h=_,s=H(_,"modelValue"),d=I(),p=re(),i=I(!1),C=B(()=>[p.textInput,{[p.empty]:!s.value,[p.inline]:h.inline}]),k=()=>{i.value=!0,W(()=>d.value.select())},N=G=>{s.value=G.target.value};return(G,D)=>(g(),$("span",{class:u(C.value)},[r("input",{ref_key:"input",ref:d,value:s.value,class:u(G.$style.input),type:"text",onBlur:D[0]||(D[0]=a=>i.value=!1),onFocus:k,onInput:N,onKeydown:D[1]||(D[1]=J((...a)=>{var c,l;return((c=d.value)==null?void 0:c.blur)&&((l=d.value)==null?void 0:l.blur(...a))},["enter"]))},null,42,Ge)],2))}}),Ve="Cb",Ne="Db",we="Eb",Ie="Fb",Te={textInput:Ve,input:Ne,inline:we,empty:Ie},Ae={$style:Te},q=P(De,[["__cssModules",Ae]]),Fe=r("span",null,null,-1),Ee=r("span",{style:{"grid-column":"3 / 16"}},null,-1),Pe=A({__name:"BudgetGroup",props:{group:{}},setup(_){const h=_,{moveBudget:s,removeBudgetGroup:d,getBudget:p,addBudget:i,setBudgetName:C,setBudgetGroupName:k,setBudget:N,removeBudget:G,isCurrentMonth:D}=O(),{t:a}=K(),c=B(()=>{const e=new Array(12).fill(0);for(const{values:f}of h.group.budgets)for(let n=0;n<f.length;n++)e[n]+=f[n];return e}),l=B(()=>Y(c.value)),b=B(()=>z(c.value)),m=e=>{const[f,n]=e.source?p(e.source)??[]:[],[M,T]=e.target?p(e.target)??[]:[];if(n&&f){if(T&&M){const V=f.id===M.id,L=V?n.name:`${f.name} » ${n.name}`,X=V?T.name:`${M.name} » ${T.name}`;return e.type==="before"?a("budget.prepend",{from:L,to:X}):a("budget.append",{from:L,to:X})}return a("budget.move",{from:n.name})}},t=e=>{s(e.source,e.target,e.type==="after")};return(e,f)=>(g(),$(w,null,[v(R,{color:"dimmed",icon:"close-circle",textual:"",onClick:f[0]||(f[0]=n=>y(d)(e.group.id))}),v(q,{class:u([e.$style.top,e.$style.start]),"model-value":e.group.name,inline:"","onUpdate:modelValue":f[1]||(f[1]=n=>y(k)(e.group.id,n))},null,8,["class","model-value"]),(g(!0),$(w,null,E(c.value,(n,M)=>(g(),$("span",{key:M,class:u(e.$style.top)},[v(F,{value:n},null,8,["value"])],2))),128)),r("span",{class:u(e.$style.top)},[r("span",null,S(y(a)("budget.total")),1)],2),r("span",{class:u([e.$style.top,e.$style.end])},[r("span",null,S(y(a)("budget.average")),1)],2),(g(!0),$(w,null,E(e.group.budgets,(n,M)=>(g(),$(w,{key:n.id+M},[v(Z,{id:n.id,name:"budget-group",text:m,onDrop:t},null,8,["id"]),v(R,{color:"dimmed",icon:"close-circle",textual:"",onClick:T=>y(G)(n.id)},null,8,["onClick"]),r("span",{class:u(e.$style.header)},[v(q,{"model-value":n.name,"onUpdate:modelValue":T=>y(C)(n.id,T)},null,8,["model-value","onUpdate:modelValue"])],2),(g(!0),$(w,null,E(n.values,(T,V)=>(g(),$("span",{key:n.id+V,class:u([e.$style.currencyCell,{[e.$style.even]:M%2,[e.$style.firstRow]:M===0,[e.$style.firstColumn]:V===0,[e.$style.currentMonth]:y(D)(V),[e.$style.tlc]:M===0&&V===0,[e.$style.trc]:M===0&&V===11,[e.$style.blc]:M===e.group.budgets.length-1&&V===0,[e.$style.brc]:M===e.group.budgets.length-1&&V===11}])},[v(Me,{"model-value":n.values[V],"onUpdate:modelValue":L=>y(N)(n.id,V,L)},null,8,["model-value","onUpdate:modelValue"])],2))),128)),v(F,{class:u(e.$style.meta),value:y(Y)(n.values)},null,8,["class","value"]),v(F,{class:u(e.$style.meta),value:y(z)(n.values)},null,8,["class","value"])],64))),128)),Fe,v(R,{icon:"plus",class:u(e.$style.addBudgetBtn),textual:"",color:"success",onClick:f[2]||(f[2]=n=>y(i)(e.group.id))},null,8,["class"]),Ee,v(F,{class:u([e.$style.meta,e.$style.bold]),value:l.value},null,8,["class","value"]),v(F,{class:u([e.$style.meta,e.$style.bold]),value:b.value},null,8,["class","value"])],64))}}),Re="ab",Se="bb",Le="cb",Ue="db",Ke="eb",Oe="fb",Xe="gb",Ye="hb",ze="ib",je="jb",qe="kb",Qe="lb",He="mb",Je="nb",We="ob",Ze={header:Re,meta:Se,bold:Le,top:Ue,start:Ke,end:Oe,currencyCell:Xe,firstRow:Ye,firstColumn:ze,currentMonth:je,even:qe,tlc:Qe,trc:He,blc:Je,brc:We},xe={$style:Ze},et=P(Pe,[["__cssModules",xe]]),tt=r("span",null,null,-1),st=r("span",null,null,-1),lt=r("span",null,null,-1),nt=r("span",null,null,-1),ot=r("span",null,null,-1),at=r("span",null,null,-1),ut=r("span",null,null,-1),rt=r("span",null,null,-1),ct=r("span",null,null,-1),dt=r("span",null,null,-1),pt=A({__name:"BudgetGroups",props:{type:{}},setup(_){const h=_,{state:s,moveBudgetGroup:d,addBudgetGroup:p,getBudgetGroup:i,isCurrentMonth:C}=O(),{t:k}=K(),N=B(()=>s[h.type]),G=pe(),D=B(()=>{const l=new Array(12).fill(0);for(const{budgets:b}of N.value)for(const{values:m}of b)for(let t=0;t<m.length;t++)l[t]+=m[t];return l}),a=l=>{const b=l.source?i(l.source):void 0,m=l.target?i(l.target):void 0;if(b)return m?l.type==="before"?k("budget.prepend",{from:b.name,to:m.name}):k("budget.append",{from:b.name,to:m.name}):k("budget.move",{from:b.name})},c=l=>{d(l.source,l.target,l.type==="after")};return(l,b)=>(g(),$("div",{class:u(l.$style.budgetGroups)},[tt,st,lt,(g(!0),$(w,null,E(y(G),(m,t)=>(g(),$("span",{key:m,class:u([l.$style.month,{[l.$style.current]:y(C)(t)}])},[r("span",null,S(m),1)],2))),128)),nt,ot,at,ut,r("span",{class:u(l.$style.sum)},S(y(k)("budget.totals")),3),(g(!0),$(w,null,E(D.value,(m,t)=>(g(),U(F,{key:t,value:m,class:u(l.$style.sum)},null,8,["value","class"]))),128)),rt,ct,(g(!0),$(w,null,E(N.value,m=>(g(),$(w,{key:m.id},[v(Z,{id:m.id,text:a,name:"budget-groups",onDrop:c},null,8,["id"]),v(et,{group:m},null,8,["group"])],64))),128)),dt,v(R,{class:u(l.$style.addGroupBtn),icon:"plus",text:y(k)("budget.addGroup"),onClick:b[0]||(b[0]=m=>y(p)(l.type))},null,8,["class","text"])],2))}}),it="p_",mt="q_",gt="r_",vt="s_",yt="t_",ft={budgetGroups:it,sum:mt,month:gt,current:vt,addGroupBtn:yt},$t={$style:ft},bt=P(pt,[["__cssModules",$t]]),_t=A({__name:"BudgetPane",props:{title:{},type:{}},setup(_){const h=_,{state:s}=O(),d=B(()=>ce(s[h.type])),p=B(()=>d.value.reduce((i,C)=>i+C,0));return(i,C)=>(g(),U(de,{amount:p.value,title:i.title},{header:j(()=>[v(ie,{class:u(i.$style.miniChart),values:d.value},null,8,["class","values"])]),default:j(()=>[v(bt,{type:i.type},null,8,["type"])]),_:1},8,["amount","title"]))}}),ht="n",Ct={miniChart:ht},Bt={$style:Ct},It=P(_t,[["__cssModules",Bt]]);export{It as B};
