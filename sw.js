const CACHE = 'gymtracker-v15';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/plan.js',
  '/js/storage.js',
  '/js/stopwatch.js',
  '/js/globalTimer.js',
  '/js/export.js',
  '/js/app.js',
  '/js/screens/daySelect.js',
  '/js/screens/exerciseList.js',
  '/js/screens/exerciseLog.js',
  '/lib/xlsx.min.js',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
