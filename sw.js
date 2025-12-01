// 🔥 FORCE NEW CACHE VERSION EVERY UPDATE
const CACHE_VERSION = "v" + Date.now();
const CACHE_NAME = "eligibility-cache-" + CACHE_VERSION;

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./favicon.ico",
  "./KOTAK_LOGO.png",
  "./manifest.json"
];

// -------------------------------------------------
// INSTALL - Cache all essential files
// -------------------------------------------------
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activate immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// -------------------------------------------------
// ACTIVATE - Delete older caches
// -------------------------------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("eligibility-cache-"))
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim(); // Start controlling pages immediately
});

// -------------------------------------------------
// FETCH - NETWORK FIRST, cache fallback
// (Ensures newest data.js + app.js loads)
// -------------------------------------------------
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Save fresh copy to cache
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request)) // fallback offline
  );
});
