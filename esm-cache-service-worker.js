const CACHE_NAME = 'esm-cache-v1';

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
  console.log('Service Worker installing...');
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  console.log('Service Worker activated!');
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  if (url.origin === 'https://esm.sh') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            return response;
          }
          
          return fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});
