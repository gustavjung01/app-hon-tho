const CACHE_VERSION = "tu-tru-pwa-v1";
const SHELL_CACHE = CACHE_VERSION + "-shell";

const SHELL_ASSETS = [
  "/nguthuat/menh/tutru/",
  "/nguthuat/menh/tutru/manifest.webmanifest",
  "/nguthuat/menh/tutru/icons/favicon.svg",
  "/nguthuat/menh/tutru/icons/app-co-hoc-icon.svg",
  "/nguthuat/menh/tutru/icons/maskable-icon.svg"
];

const NEVER_CACHE_PREFIXES = [
  "/api/",
  "/admin/",
  "/account/",
  "/auth/",
  "/conversations/",
  "/sessions/",
  "/billing/",
  "/settings/"
];

const NEVER_CACHE_PARTS = [
  "/ai/",
  "/chat",
  "/dialogflow",
  "/app-runs",
  "/runs",
  "/history"
];

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function shouldNeverCache(url) {
  if (!isSameOrigin(url)) return true;
  return NEVER_CACHE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix)) || NEVER_CACHE_PARTS.some((part) => url.pathname.includes(part));
}

function isStaticAsset(url, request) {
  if (!isSameOrigin(url)) return false;
  if (shouldNeverCache(url)) return false;
  if (request.destination === "style" || request.destination === "script" || request.destination === "font" || request.destination === "image" || request.destination === "manifest") return true;
  return url.pathname.startsWith("/nguthuat/menh/tutru/assets/") || url.pathname.startsWith("/nguthuat/menh/tutru/icons/");
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("tu-tru-pwa-") && key !== SHELL_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (shouldNeverCache(url)) return;

  if (isStaticAsset(url, request)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request).then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  if (request.mode === "navigate" && url.pathname.startsWith("/nguthuat/menh/tutru/")) {
    event.respondWith(
      fetch(request).catch(() => caches.match("/nguthuat/menh/tutru/"))
    );
  }
});
