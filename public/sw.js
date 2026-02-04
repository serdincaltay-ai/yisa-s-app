// YİSA-S Service Worker v2.0
const CACHE_NAME = 'yisa-s-v2'
const OFFLINE_URL = '/offline.html'

// Önbelleğe alınacak statik dosyalar
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/auth/login',
  '/icon-192.png',
  '/icon-512.png',
  '/icon.svg',
  '/manifest.json'
]

// Service Worker kurulumu
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Önbellek açıldı')
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('[SW] Bazı dosyalar önbelleğe alınamadı:', err)
      })
    })
  )
  self.skipWaiting()
})

// Service Worker aktivasyonu
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Eski önbellek siliniyor:', name)
            return caches.delete(name)
          })
      )
    })
  )
  self.clients.claim()
})

// Fetch istekleri
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // API istekleri için network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Başarılı API yanıtını önbelleğe al (GET istekleri için)
          if (request.method === 'GET' && response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Offline durumda önbellekten dene
          return caches.match(request)
        })
    )
    return
  }

  // Statik dosyalar için cache-first
  if (
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|css|js|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
      })
    )
    return
  }

  // HTML sayfaları için network-first with fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Başarılı sayfa yanıtını önbelleğe al
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Offline durumda önbellekten dene
          return caches.match(request).then((cached) => {
            if (cached) return cached
            // Önbellekte yoksa offline sayfası göster
            return caches.match(OFFLINE_URL).catch(() => {
              return new Response(
                '<html><body><h1>Çevrimdışı</h1><p>İnternet bağlantınızı kontrol edin.</p></body></html>',
                { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
              )
            })
          })
        })
    )
    return
  }

  // Diğer istekler için network-first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  )
})

// Push bildirimleri (ileride kullanılabilir)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body || 'YİSA-S bildirimi',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: { url: data.url || '/dashboard' }
    }
    event.waitUntil(
      self.registration.showNotification(data.title || 'YİSA-S', options)
    )
  }
})

// Bildirime tıklama
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/dashboard'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

console.log('[SW] YİSA-S Service Worker yüklendi')
