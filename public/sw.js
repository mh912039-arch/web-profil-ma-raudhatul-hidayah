// Service Worker untuk Portal MA Raudlatul Hidayah (PWA)
const CACHE_NAME = 'mrh-portal-cache-v1';

// Daftar aset inti yang dapat dicache awal
const PRECACHE_ASSETS = [
  '/',
  '/admin',
  '/masuk',
  '/school-logo.png',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Network-First untuk navigasi & rute dinamis (/api/*), cache fallback untuk aset statis
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Jangan sentuh request API atau POST/PUT/DELETE
  if (
    request.method !== 'GET' ||
    request.url.includes('/api/') ||
    request.url.includes('/_next/data/')
  ) {
    return;
  }

  // Untuk navigasi halaman (HTML), selalu ambil dari network terlebih dahulu
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(request).then((cached) => cached || caches.match('/admin')))
    );
    return;
  }

  // Untuk gambar dan aset statis lainnya: Cache First dengan Network Update
  if (
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache).catch(() => {});
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default passthrough fetch
  event.respondWith(fetch(request));
});
