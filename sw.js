if(!self.define){let s,e={};const n=(n,l)=>(n=new URL(n+".js",l).href,e[n]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=n,s.onload=e,document.head.appendChild(s)}else s=n,importScripts(n),e()})).then((()=>{let s=e[n];if(!s)throw new Error(`Module ${n} didn’t register its module`);return s})));self.define=(l,i)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let a={};const u=s=>n(s,r),o={module:{uri:r},exports:a,require:u};e[r]=Promise.all(l.map((s=>o[s]||u(s)))).then((s=>(i(...s),a)))}}define(["./workbox-4de3aa5f"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"assets/_commonjsHelpers-725317a4.js",revision:null},{url:"assets/AnimatedRouterView-294045fe.js",revision:null},{url:"assets/AnimatedRouterView-e3850a82.css",revision:null},{url:"assets/AsyncComponent-1309764e.css",revision:null},{url:"assets/AsyncComponent-fe4f01d2.js",revision:null},{url:"assets/BudgetPane-1aab2e75.js",revision:null},{url:"assets/BudgetPane-21d0a6af.css",revision:null},{url:"assets/budgets-531db56b.js",revision:null},{url:"assets/Button-051eba21.css",revision:null},{url:"assets/Button-b2fdb1cc.js",revision:null},{url:"assets/ChartPlaceholder-26119b8c.css",revision:null},{url:"assets/ChartPlaceholder-f563e0db.js",revision:null},{url:"assets/Currency-3020d51f.css",revision:null},{url:"assets/Currency-6a4187cb.js",revision:null},{url:"assets/Dashboard-2fade9bd.js",revision:null},{url:"assets/Dashboard-65631b64.css",revision:null},{url:"assets/DemoData-06204352.js",revision:null},{url:"assets/DevelopmentChart-4996f946.js",revision:null},{url:"assets/DevelopmentChart-ccb73121.css",revision:null},{url:"assets/DistributionChart-0cfc4e4b.js",revision:null},{url:"assets/DistributionChart-2172590f.css",revision:null},{url:"assets/EChart.vue_vue_type_script_setup_true_lang-b4618b29.js",revision:null},{url:"assets/Expenses-5d3c47b3.js",revision:null},{url:"assets/Frame-4381430f.css",revision:null},{url:"assets/Frame-5392a01a.js",revision:null},{url:"assets/Icon-2d00bfea.css",revision:null},{url:"assets/Icon-f8fd3aa4.js",revision:null},{url:"assets/Income-5676592d.js",revision:null},{url:"assets/index-dc331eb1.js",revision:null},{url:"assets/index-e09977d8.css",revision:null},{url:"assets/Link-4e899538.css",revision:null},{url:"assets/Link-f3af7cd8.js",revision:null},{url:"assets/main-44350b7b.js",revision:null},{url:"assets/Overview-4dcafe30.js",revision:null},{url:"assets/Overview-61119d5f.css",revision:null},{url:"assets/Pane-29596b0d.js",revision:null},{url:"assets/Pane-f5327f4e.css",revision:null},{url:"assets/Summary-61e0c78f.css",revision:null},{url:"assets/Summary-6e274099.js",revision:null},{url:"assets/useMonthNames-ed942eab.js",revision:null},{url:"assets/useResizeObserver-81a2c62d.js",revision:null},{url:"assets/useThemeStyles-b56d524a.js",revision:null},{url:"assets/workbox-window.prod.es5-a7b12eab.js",revision:null},{url:"index.html",revision:"ee34237c5292d84fd3e4c739f9a05c95"},{url:"images/icon-maskable-192x192.png",revision:"6f7776c00ea4989bfe9f596a862874ae"},{url:"images/icon-maskable-256x256.png",revision:"edc41cd303465aa068a0883e6c80aaec"},{url:"images/icon-maskable-512x512.png",revision:"219d10726cb1fe2ec4d82ee792cc9171"},{url:"images/icon-maskable-1024x1024.png",revision:"8eafbf60e614f60e20368cecacd6b1dd"},{url:"images/icon-192x192.png",revision:"3f1c9737c3ea2218d437239ed852bd8d"},{url:"images/icon-512x512.png",revision:"8377a3bb55077554423bbbf6ef2df394"},{url:"images/icon-1024x1024.png",revision:"e0256998bec2278de5c61376a4aae7e1"},{url:"manifest.webmanifest",revision:"4a814bd4f2ed2afb3d55d1d072a1f2d5"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
