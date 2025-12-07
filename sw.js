// --------------------------------------------------
// 🔥 FORCE NEW CACHE VERSION EVERY UPDATE
// --------------------------------------------------
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

// --------------------------------------------------
// INSTALL → Cache essential local files
// --------------------------------------------------
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activate immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// --------------------------------------------------
// ACTIVATE → Remove old caches
// --------------------------------------------------
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

  self.clients.claim();
});

// --------------------------------------------------
// FETCH HANDLER (Single listener)
// Network-first for local files
// Bypass Supabase completely
// --------------------------------------------------
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // -----------------------------------------------
  // 🚫 BYPASS SUPABASE → DO NOT CACHE OR INTERCEPT
  // -----------------------------------------------
  if (url.includes("supabase.co")) {
    return; // Let browser fetch normally
  }

  // -----------------------------------------------
  // Normal app files → NETWORK FIRST
  // Ensures latest JS & data loads
  // -----------------------------------------------
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Update cache with fresh copy
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)) // Offline fallback
  );
});
