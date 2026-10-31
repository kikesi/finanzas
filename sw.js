/* Service worker de Finanzas: guarda la app para abrirla al instante y avisa cuando hay versión nueva.
   Los datos nunca se guardan aquí: siempre se piden al servicio de Google. */
const VERSION = '1.1.0';
const CACHE = 'finanzas-' + VERSION;
const ARCHIVOS = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('finanzas-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'actualizar') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;   // el servicio de Google va directo
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
