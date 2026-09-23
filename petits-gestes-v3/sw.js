const CACHE="petits-gestes-v3-2026-09-23-five";
const CORE=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./assets/hero.b64",
  "../petits-gestes/assets/explore.webp",
  "../petits-gestes/assets/list.webp",
  "../petits-gestes/assets/detail.webp"
];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>Promise.allSettled(CORE.map(url=>cache.add(url))))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  event.respondWith(
    fetch(event.request)
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
        return response;
      })
      .catch(()=>caches.match(event.request).then(hit=>{
        if(hit)return hit;
        if(event.request.mode==="navigate")return caches.match("./index.html");
        return Response.error();
      }))
  );
});