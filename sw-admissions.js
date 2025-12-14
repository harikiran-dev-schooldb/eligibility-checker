/**************************************************
 KSS – ADMISSIONS SERVICE WORKER
 Network-first | Safe cache | No Supabase caching
**************************************************/

const CACHE_NAME = "kss-admissions-cache-v1";

const ASSETS_TO_CACHE = [
  "./admissions.html",
  "./css/admissions.css",
  "./favicon.ico",
  "./KOTAK_LOGO.png",

  "./js/admissions/config.js",
  "./js/admissions/utils.js",
  "./js/admissions/state.js",
  "./js/admissions/dom.js",
  "./js/admissions/auth.js",
  "./js/admissions/filters.js",
  "./js/admissions/table.js",
  "./js/admissions/stages.js",
  "./js/admissions/whatsapp.js",
  "./js/admissions/export.js",
  "./js/admissions/main.js"
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
          console.warn("[Admissions SW] Skipped:", asset);
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
// FETCH – Network First
// --------------------------------------------------
self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;
  if (req.url.includes("supabase.co")) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, clone));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
