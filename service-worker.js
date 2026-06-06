const CACHE_NAME = 'poke-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './game.html',
  './manifest.json',
  './cards/pokelogo.png',
  './game-css/style.css',
  './game-css/game.css',
  './JavaScript/login.js',
  './JavaScript/game.js',
  './Audio/Ruby.mp3',
  './Audio/POkevictory.mp3',
  './Audio/Opening - Pokémon Ruby_Sapphire_Emerald Soundtrack - Daintii Music (youtube).mp3',
  './img/pokefundo.png',
  './img/fundinho.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url).catch(err => {
            console.log('Falhou ao guardar no cache:', url, err);
            return null;
          }))
        );
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    try {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      return await fetch(event.request);
    } catch (err) {
      console.error('Service worker fetch erro:', err, event.request.url);
      return new Response('', { status: 504, statusText: 'Service Worker Offline' });
    }
  })());
});