/*!
 * Winetime Asia — Service Worker
 * App-shell caching for offline-friendly browsing.
 * Bump CACHE_VERSION whenever precached files change.
 */
const CACHE_VERSION = "wt-v11";
const STATIC_CACHE = CACHE_VERSION + "-static";
const PAGES_CACHE = CACHE_VERSION + "-pages";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./about.html",
  "./event-wedding.html",
  "./bar-a-vin.html",
  "./contact.html",
  "./blog.html",
  "./forum.html",
  "./cookie-policy.html",
  "./offline.html",
  "./404.html",
  "./css/style.css",
  "./js/site.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/logo-horizontal.png",
  "./icons/favicon-48.png",
  "./icons/apple-touch-icon.png",
  "./fr/index.html",
  "./fr/about.html",
  "./fr/event-wedding.html",
  "./fr/bar-a-vin.html",
  "./fr/contact.html",
  "./fr/blog.html",
  "./fr/forum.html",
  "./fr/cookie-policy.html",
  "./zh/index.html",
  "./zh/about.html",
  "./zh/event-wedding.html",
  "./zh/bar-a-vin.html",
  "./zh/contact.html",
  "./zh/blog.html",
  "./zh/forum.html",
  "./zh/cookie-policy.html",
  "./km/index.html",
  "./km/about.html",
  "./km/event-wedding.html",
  "./km/bar-a-vin.html",
  "./km/contact.html",
  "./km/blog.html",
  "./km/forum.html",
  "./km/cookie-policy.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("wt-") && key !== STATIC_CACHE && key !== PAGES_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Never intercept the external shop, or non-GET requests.
function shouldHandle(request) {
  if (request.method !== "GET") return false;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  return true;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (!shouldHandle(request)) return;

  // HTML navigations: network-first, cache fallback, offline page as last resort.
  if (request.mode === "navigate" || (request.headers.get("accept") || "").includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PAGES_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("./offline.html"))
        )
    );
    return;
  }

  // Static assets: cache-first, update in background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
