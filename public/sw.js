const CACHE = 'fittrack-v2'

self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  )
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        const clone = r.clone()
        caches.open(CACHE).then((c) => c.put(e.request, clone))
        return r
      })
      .catch(() => caches.match(e.request))
  )
})
