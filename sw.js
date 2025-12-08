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
  "./favicon.ico",
  "./KOTAK_LOGO.png",
  "./manifest.json"
];

// --------------------------------------------------
// INSTALL
// --------------------------------------------------
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
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
          .filter((key) => key.startsWith("eligibility-cache-"))
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// --------------------------------------------------
// FETCH (Final Clean Version)
// --------------------------------------------------
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = req.url;

  // ------------------------------------------------
  // 🚫 1. Ignore ALL non-GET requests
  // ------------------------------------------------
  if (req.method !== "GET") {
    return;
  }

  // ------------------------------------------------
  // 🚫 2. Ignore external APIs (Supabase, GitHub API calls)
  // ------------------------------------------------
  if (url.includes("supabase.co") || url.includes("api.github.com")) {
    return;
  }

  // ------------------------------------------------
  // ⭐ 3. ALWAYS FETCH data.js FRESH FROM NETWORK
  // ------------------------------------------------
  if (url.includes("data.js")) {
    event.respondWith(
      fetch(url + "?v=" + Date.now(), { cache: "no-store" })
    );
    return;
  }

  // ------------------------------------------------
  // 4. NETWORK-FIRST for local app files
  // ------------------------------------------------
  event.respondWith(
    fetch(req)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        return response;
      })
      .catch(() => caches.match(req))
  );
});
