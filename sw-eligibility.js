/**************************************************
 KSS – ELIGIBILITY SERVICE WORKER
 Network-first | Safe cache | No Supabase caching
**************************************************/

const CACHE_NAME = "kss-eligibility-cache-v1";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./css/eligibility.css",
  "./favicon.ico",
  "./KOTAK_LOGO.png",
  "./manifest.json",

  "./js/eligibility/config.js",
  "./js/eligibility/utils.js",
  "./js/eligibility/eligibility.js",
  "./js/eligibility/fees.js",
  "./js/eligibility/admission.js",
  "./js/eligibility/whatsapp.js",
  "./js/eligibility/main.js"
];

// --------------------------------------------------
// INSTALL
// --------------------------------------------------
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn("[Eligibility SW] Skipped:", asset);
        }
      }
    })
  );
});

// --------------------------------------------------
// ACTIVATE
// --------------------------------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// --------------------------------------------------
// FETCH – Network First (SAFE)
// --------------------------------------------------
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Ignore non-http(s)
  if (!request.url.startsWith("http")) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((networkResponse) => {
        // 🚫 Do not cache opaque or invalid responses
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== "basic"
        ) {
          return networkResponse;
        }

        // ✅ CLONE IMMEDIATELY
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});


