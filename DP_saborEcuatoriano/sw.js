// =====================================================
//  Service Worker para PWA
//  Ref: Sem 5 sec 5.3 punto 7 (Progressive Web Apps)
// =====================================================

const CACHE = "sabor-ec-v1";
const RECURSOS = [
  "./",
  "./index.html",
  "./assets/styles.css",
  "./model/productos.json",
  "./model/repo.js",
  "./model/carrito.js",
  "./model/validacion.js",
  "./view/vista.js",
  "./controller/app.js",
  "./manifest.webmanifest",
  "https://code.jquery.com/jquery-3.6.0.min.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(RECURSOS);
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (resp) {
      return resp || fetch(e.request);
    })
  );
});