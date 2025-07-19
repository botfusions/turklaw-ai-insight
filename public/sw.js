
const CACHE_NAME = 'turklaw-ai-v2';
const STATIC_CACHE = 'turklaw-static-v2';
const DYNAMIC_CACHE = 'turklaw-dynamic-v2';

// Simple cache-first strategy for performance
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Clear old caches
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Simplified fetch handler - only cache GET requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin requests
  if (request.method !== 'GET' || url.origin !== location.origin) {
    return;
  }

  // Skip Supabase and external API requests
  if (url.href.includes('supabase.co') || 
      url.href.includes('supabase.com') ||
      url.pathname.startsWith('/api/') ||
      url.hostname !== location.hostname) {
    return;
  }

  // Simple network-first strategy for all local resources
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone).catch((error) => {
              console.warn('Cache put failed:', error);
            });
          });
        }
        return response;
      })
      .catch((error) => {
        console.warn('Fetch failed, trying cache:', error);
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // For navigation requests, try to return the main page
          if (request.mode === 'navigate') {
            return caches.match('/').then((indexResponse) => {
              if (indexResponse) {
                return indexResponse;
              }
              // If nothing is cached, return a simple offline page
              return new Response('<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>Bağlantı Yok</h1><p>Lütfen internet bağlantınızı kontrol edin.</p></body></html>', {
                headers: { 'Content-Type': 'text/html' }
              });
            });
          }
          throw error;
        });
      })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(
      // Handle background sync tasks
      Promise.resolve()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'TurkLaw AI\'dan yeni bildirim',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Görüntüle',
        icon: '/placeholder.svg'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/placeholder.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('TurkLaw AI', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
