const CACHE_NAME = "mata-monstret-cache-v7";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./src/audio.js",
  "./src/data.js",
  "./src/main.js",
  "./src/questions.js",
  "./src/render.js",
  "./src/settings.js",
  "./src/voice-lines.js",
  "./manifest.json",
  "./icons/icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(cacheNames.map((cacheName) => cacheName === CACHE_NAME ? null : caches.delete(cacheName))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (event.request.url.startsWith(self.location.origin) && networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }

          return networkResponse;
        })
        .catch(() => event.request.mode === "navigate" ? caches.match("./index.html") : null);
    })
  );
});
