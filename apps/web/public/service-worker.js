const CACHE_VERSION = "app-co-hoc-v20";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/maskable-512.png",
  "/hontho-auth-bridge.js",
  "/account-stabilizer.js",
  "/app-version-watch.js",
  "/mobile-polish.css",
  "/icons/app-icon.svg"
];
const STATIC_ASSET_RE = /\.(?:js|css|png|jpg|jpeg|svg|webp|gif|ico|woff2?)$/i;
const PHONG_THUY_ENTRY = "/nguthuat/son/phongthuy/index.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname === "/service-worker.js" || url.pathname === "/manifest.webmanifest" || url.pathname === "/app-version.json") return;

  if (url.pathname === "/nguthuat/son/phongthu" || url.pathname === "/nguthuat/son/phongthu/" || url.pathname === "/nguthuat/son/phongthu/index.html" || url.pathname === "/nguthuat/son/phongthuy" || url.pathname === "/nguthuat/son/phongthuy/") {
    event.respondWith(Response.redirect(PHONG_THUY_ENTRY, 302));
    return;
  }

  if (url.pathname === PHONG_THUY_ENTRY || url.pathname.startsWith("/nguthuat/son/phongthuy/")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (STATIC_ASSET_RE.test(url.pathname) || APP_SHELL.includes(url.pathname)) {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirstNavigation(request) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const response = await fetch(request, { cache: "no-store" });
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch (e) {
    const cached = await cache.match(request);
    return cached || cache.match("/");
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);

  return cached || network;
}
