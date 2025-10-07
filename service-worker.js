const CACHE_NAME = "sayidisi-v2";
const BASE_PATH = "/sayidisi";

const ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/assets/bundle.js`,
  `${BASE_PATH}/assets/icons/icon-192.png`,
  `${BASE_PATH}/assets/icons/icon-512.png`
];

// Service Worker yüklenince
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Ağ isteklerini yakala
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => {
          // Offline fallback (örnek: basit bir mesaj sayfası)
          return new Response("<h1>Offline!</h1>", {
            headers: { "Content-Type": "text/html" }
          });
        })
      );
    })
  );
});

// Güncelleme ve eski cache'leri temizleme
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});
