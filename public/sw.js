// Service Worker untuk Portal MA Raudlatul Hidayah (PWA)
const CACHE_NAME = 'mrh-portal-cache-v5';

// Daftar aset inti yang dapat dicache awal
const PRECACHE_ASSETS = [
  '/',
  '/admin',
  '/masuk',
  '/school-logo.png',
  '/badge-96.png',
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

// ============================================================================
// WEB PUSH NOTIFICATION HANDLERS (MAS RH Mobile PWA)
// ============================================================================
self.addEventListener('push', (event) => {
  let data = {
    title: 'Portal MAS Raudlatul Hidayah',
    body: 'Ada pembaruan informasi akademik terbaru.',
    icon: '/school-logo.png',
    badge: '/badge-96.png',
    url: '/admin',
  };

  try {
    if (event.data) {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    }
  } catch (err) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const notificationOptions = {
    body: data.body,
    icon: data.icon || '/school-logo.png',
    badge: data.badge || '/badge-96.png',
    vibrate: [200, 100, 200],
    tag: data.tag || `mrh-push-${Date.now()}`,
    renotify: true,
    data: data.data || { url: data.url || '/admin' },
    actions: [
      { action: 'open_url', title: 'Buka Portal' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, notificationOptions));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/admin';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Jika ada window/tab terbuka, arahkan ke target URL dan fokuskan
      for (let client of windowClients) {
        if ('focus' in client) {
          if ('navigate' in client && targetUrl) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // Jika belum ada window yang terbuka, buka tab baru
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

