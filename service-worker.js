const CACHE_NAME = 'brewhaven-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/dark-mode.css',
    '/css/bootstrap.min.css',
    '/js/script.js',
    '/js/animations.js',
    '/js/bootstrap.bundle.min.js',
    '/images/logo.svg',
    '/images/coffee-hero.webp',
    '/images/about.webp',
    '/images/coffee-1.webp',
    '/images/coffee-2.webp',
    '/images/coffee-3.webp',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-512x512.png'
];

// Install service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ASSETS);
            })
    );
});

// Fetch assets from cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

// Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});