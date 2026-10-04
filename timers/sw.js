/**
 * Service worker: rende l'applicazione utilizzabile offline e installabile.
 *
 * La versione fa parte del nome della cache, quindi pubblicare una versione
 * nuova invalida tutto il vecchio contenuto invece di lasciare in giro file
 * disallineati fra loro. Va tenuta uguale a `VERSION` di `core.js`.
 */

const VERSION = "1.3.0";
const CACHE_PREFIX = "ragnarok-timers-";
const CACHE = `${CACHE_PREFIX}${VERSION}`;

const ASSETS = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "core.js",
  "../gate.js",
  "storage.js",
  "alerts.js",
  "manifest.webmanifest",
  "../icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()),
  );
});

// Le cache sono dell'intero albgri.github.io, non di questa cartella: si
// cancellano solo le versioni vecchie dei timer, non quelle di altri servizi.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  // Si risponde dalla cache e si aggiorna in sottofondo: l'applicazione parte
  // anche senza rete e la versione nuova entra in uso al caricamento seguente.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached ?? network;
    }),
  );
});
