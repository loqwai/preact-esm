const CACHE_NAME = 'esm-cache-v1';

const cdns = [
  "https://unpkg.com",
  "https://esm.sh",
]
const cacheCdnRequests = async (request) => {
  const url = new URL(request.url);
  if(!cdns.includes(url.origin)) return fetch(request);

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
