const CACHE="hybrid-wood-v1";
const FILES=["./","./index.html","./styles.css","./app.js","./films.js","./manifest.webmanifest","./assets/hybridwood_studios.jpeg","./assets/hybridwood_logo.jpeg","./assets/platform_background.jpg","./assets/autre_homme.jpeg","./assets/annie.jpeg","./assets/ombre_noire_matrice.jpeg","./assets/lamour_poster.png","./assets/inconnu_connu.jpeg","./assets/18te.jpeg","./assets/zile_sekre.jpeg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
