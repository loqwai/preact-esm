const CACHE_NAME = 'esm-cache-v1';



const cacheCdnRequests = async (request) =>{
  const url = new URL(request.url);
  if (url.origin !== 'https://esm.sh') return fetch(request);

  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(request);
  if(response?.ok) return response

  const netResponse = await fetch(request);
  cache.put(request, netResponse.clone());
  return netResponse;
}

self.addEventListener('fetch', (event) => {
  event.respondWith(cacheCdnRequests(event.request))
});
