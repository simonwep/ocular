if(!self.define){let s,e={};const n=(n,l)=>(n=new URL(n+".js",l).href,e[n]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=n,s.onload=e,document.head.appendChild(s)}else s=n,importScripts(n),e()})).then((()=>{let s=e[n];if(!s)throw new Error(`Module ${n} didn’t register its module`);return s})));self.define=(l,i)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let a={};const u=s=>n(s,r),t={module:{uri:r},exports:a,require:u};e[r]=Promise.all(l.map((s=>t[s]||u(s)))).then((s=>(i(...s),a)))}}define(["./workbox-b3e22772"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"assets/AnimatedRouterView.357b1d7d.js",revision:null},{url:"assets/AnimatedRouterView.e98dcee7.css",revision:null},{url:"assets/AsyncComponent.cf02fa6b.css",revision:null},{url:"assets/AsyncComponent.e61b8f5f.js",revision:null},{url:"assets/BudgetPane.f80233f1.css",revision:null},{url:"assets/BudgetPane.fd19d86a.js",revision:null},{url:"assets/budgets.8c854936.js",revision:null},{url:"assets/Button.962752ad.js",revision:null},{url:"assets/Button.ad1f733c.css",revision:null},{url:"assets/ChartPlaceholder.0e0b4b4f.css",revision:null},{url:"assets/ChartPlaceholder.a79c771c.js",revision:null},{url:"assets/Currency.vue_vue_type_script_setup_true_lang.1e8cccd6.js",revision:null},{url:"assets/Dashboard.45cca764.css",revision:null},{url:"assets/Dashboard.9cd51fe2.js",revision:null},{url:"assets/DevelopmentChart.1af7104e.css",revision:null},{url:"assets/DevelopmentChart.5ed2d17f.js",revision:null},{url:"assets/DistributionChart.720ffbf0.js",revision:null},{url:"assets/DistributionChart.e3f7a91c.css",revision:null},{url:"assets/Expenses.4652fc7a.js",revision:null},{url:"assets/Frame.3f4f486b.css",revision:null},{url:"assets/Frame.4eff8508.js",revision:null},{url:"assets/Icon.138b446c.css",revision:null},{url:"assets/Icon.8230e168.js",revision:null},{url:"assets/Income.e1910627.js",revision:null},{url:"assets/index.6c623347.css",revision:null},{url:"assets/index.74037899.js",revision:null},{url:"assets/installSVGRenderer.14d161e6.js",revision:null},{url:"assets/Link.20ce9dca.css",revision:null},{url:"assets/Link.565f4bb6.js",revision:null},{url:"assets/Overview.a285444e.js",revision:null},{url:"assets/Overview.cdc2a2cb.css",revision:null},{url:"assets/Pane.067b67f3.css",revision:null},{url:"assets/Pane.bc0de933.js",revision:null},{url:"assets/Summary.d53cfc13.css",revision:null},{url:"assets/Summary.da7710bb.js",revision:null},{url:"assets/useMonthNames.62badf26.js",revision:null},{url:"assets/useResizeObserver.29c1e022.js",revision:null},{url:"assets/useThemeStyles.b7e5b79a.js",revision:null},{url:"index.html",revision:"439eb092f48ca067d6a8183a11ebd46e"},{url:"images/icon-maskable-192x192.png",revision:"6f7776c00ea4989bfe9f596a862874ae"},{url:"images/icon-maskable-256x256.png",revision:"edc41cd303465aa068a0883e6c80aaec"},{url:"images/icon-maskable-512x512.png",revision:"219d10726cb1fe2ec4d82ee792cc9171"},{url:"images/icon-maskable-1024x1024.png",revision:"8eafbf60e614f60e20368cecacd6b1dd"},{url:"images/icon-192x192.png",revision:"3f1c9737c3ea2218d437239ed852bd8d"},{url:"images/icon-512x512.png",revision:"8377a3bb55077554423bbbf6ef2df394"},{url:"images/icon-1024x1024.png",revision:"e0256998bec2278de5c61376a4aae7e1"},{url:"manifest.webmanifest",revision:"4a814bd4f2ed2afb3d55d1d072a1f2d5"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
