const CACHE_NAME = 'thinkingkit-v1';
const CRITICAL_ASSETS = [
  '/',
  '/css/main.css',
  '/js/models-data.js',
  '/models/',
  '/tools/',
  '/start-here/',
  '/learn/foundations/'
];

// Install: cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CRITICAL_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback
// This is the antifragile strategy: try the network (get fresh content),
// fall back to cache (survive outages), and cache new responses (get stronger over time)
self.addEventListener('fetch', (event) => {
  // Only cache GET requests for our own domain
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // Skip API calls and external resources
  if (event.request.url.includes('/api/') || event.request.url.includes('anthropic.com')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Network succeeded — cache the response for future offline use
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed — serve from cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // If not in cache and it's a navigation, show the cached homepage
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
