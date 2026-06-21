// ════════════════════════════════════════════════════════
// DIDIAL OT — Service Worker
// Permite funcionamiento offline y actualización automática
// ════════════════════════════════════════════════════════
const CACHE_NAME = 'didial-ot-v5.4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

// Instalación: cachea los archivos base
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activación: limpia cachés viejos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: estrategia network-first para el envío de datos,
// cache-first para los archivos de la app
self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  // NUNCA cachear las llamadas al Apps Script (deben ir siempre a la red)
  if (url.includes('script.google.com')) {
    return; // deja pasar la petición normal a la red
  }

  // Para los archivos de la app: cache-first
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((resp) => {
        return caches.open(CACHE_NAME).then((cache) => {
          if (e.request.method === 'GET') cache.put(e.request, resp.clone());
          return resp;
        });
      }).catch(() => cached);
    })
  );
});
