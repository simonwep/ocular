if(!self.define){let s,e={};const l=(l,n)=>(l=new URL(l+".js",n).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(n,i)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let u={};const a=s=>l(s,r),o={module:{uri:r},exports:u,require:a};e[r]=Promise.all(n.map((s=>o[s]||a(s)))).then((s=>(i(...s),u)))}}define(["./workbox-4de3aa5f"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"assets/_commonjsHelpers-725317a4.js",revision:null},{url:"assets/AnimatedRouterView-332f0918.js",revision:null},{url:"assets/AnimatedRouterView-56c49743.css",revision:null},{url:"assets/AsyncComponent-7dcc3ee4.js",revision:null},{url:"assets/AsyncComponent-fe08b12c.css",revision:null},{url:"assets/BudgetPane-3d253730.css",revision:null},{url:"assets/BudgetPane-dd7ea1f5.js",revision:null},{url:"assets/budgets-531db56b.js",revision:null},{url:"assets/Button-7c7acf0a.js",revision:null},{url:"assets/Button-d60163ea.css",revision:null},{url:"assets/ChartPlaceholder-26119b8c.css",revision:null},{url:"assets/ChartPlaceholder-e50360ff.js",revision:null},{url:"assets/Currency-7e07fb54.css",revision:null},{url:"assets/Currency-f00eca8f.js",revision:null},{url:"assets/Dashboard-9b414d16.css",revision:null},{url:"assets/Dashboard-eca26531.js",revision:null},{url:"assets/DemoData-06204352.js",revision:null},{url:"assets/DevelopmentChart-0c000d6f.js",revision:null},{url:"assets/DevelopmentChart-ccb73121.css",revision:null},{url:"assets/DistributionChart-11c97836.js",revision:null},{url:"assets/DistributionChart-5404add7.css",revision:null},{url:"assets/EChart.vue_vue_type_script_setup_true_lang-f82b7fdc.js",revision:null},{url:"assets/Expenses-833cad13.js",revision:null},{url:"assets/Frame-66c00bc5.css",revision:null},{url:"assets/Frame-76596e2e.js",revision:null},{url:"assets/IBMPlexSans-Bold-7fae27cb.woff2",revision:null},{url:"assets/IBMPlexSans-Light-1b5930de.woff2",revision:null},{url:"assets/IBMPlexSans-Medium-0d831a6a.woff2",revision:null},{url:"assets/IBMPlexSans-Regular-35c550c1.woff2",revision:null},{url:"assets/IBMPlexSans-SemiBold-4dac4e29.woff2",revision:null},{url:"assets/Icon-2d00bfea.css",revision:null},{url:"assets/Icon-8760e494.js",revision:null},{url:"assets/Income-ad46f710.js",revision:null},{url:"assets/index-6b70ab40.css",revision:null},{url:"assets/index-bff5bb42.js",revision:null},{url:"assets/Link-2200b827.css",revision:null},{url:"assets/Link-bd8d1a8d.js",revision:null},{url:"assets/main-44350b7b.js",revision:null},{url:"assets/Overview-5f321b02.css",revision:null},{url:"assets/Overview-a74d0ac0.js",revision:null},{url:"assets/Pane-b1cd382e.css",revision:null},{url:"assets/Pane-cc25198e.js",revision:null},{url:"assets/Summary-610345e1.css",revision:null},{url:"assets/Summary-d22f1b52.js",revision:null},{url:"assets/useMonthNames-713ca91d.js",revision:null},{url:"assets/useResizeObserver-f9048134.js",revision:null},{url:"assets/useThemeStyles-128ca879.js",revision:null},{url:"assets/workbox-window.prod.es5-a7b12eab.js",revision:null},{url:"index.html",revision:"172b2a0147fc9c902d911a4c05e3bcf1"},{url:"images/icon-maskable-192x192.png",revision:"63967da70f2ae60c5a47f76cf4e377a6"},{url:"images/icon-maskable-256x256.png",revision:"1684b9c709dd96f30ff36195f8e4ef0e"},{url:"images/icon-maskable-512x512.png",revision:"6155bde7d596bd6a56764591b23cdeb2"},{url:"images/icon-maskable-1024x1024.png",revision:"73ed090e846296ed65e2e6f0ff797ddb"},{url:"images/icon-192x192.png",revision:"eee5c05355951e070c3627be215cef8a"},{url:"images/icon-512x512.png",revision:"cf652f09fc299c7727be11e25888f8fe"},{url:"images/icon-1024x1024.png",revision:"592da787a634488149b2d15c0fee22a9"},{url:"manifest.webmanifest",revision:"4a814bd4f2ed2afb3d55d1d072a1f2d5"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
