const C='moneybag-v2';
const A=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  // শুধু অ্যাপের নিজস্ব ফাইল ও ফন্ট ক্যাশ হবে; Google Drive/অথ রিকোয়েস্ট সরাসরি নেটওয়ার্কে যাবে
  if(u.origin!==location.origin&&!/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))return;
  e.respondWith(caches.match(e.request).then(r=>{
    const f=fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res}).catch(()=>r);
    return r||f;
  }));
});
