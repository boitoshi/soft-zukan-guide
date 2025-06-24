/**
 * Service Worker for Pokemon Zukan Master
 * オフライン対応とキャッシュ管理
 */

const CACHE_NAME = 'pokemon-zukan-v3.0.0';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/overview.html',
  '/manifest.json',
  '/zukan-config.json',
  '/paldea_zukan_data.json',
  '/galar_zukan_data.json'
];

// Dynamic cache patterns
const DYNAMIC_CACHE_PATTERNS = [
  /\/src\//,
  /\/assets\//,
  /\.js$/,
  /\.css$/,
  /\.vue$/,
  /\.ts$/
];

// Install event - キャッシュ作成
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static files...');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('✅ Static cache created successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Cache creation failed:', error);
      })
  );
});

// Activate event - 古いキャッシュ削除
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - リクエスト処理
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    handleRequest(request)
  );
});

// Request handling strategy
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Static files - Cache First
    if (isStaticFile(url.pathname)) {
      return await cacheFirst(request);
    }
    
    // Dynamic files - Network First
    if (isDynamicFile(url.pathname)) {
      return await networkFirst(request);
    }
    
    // API calls - Network First with fallback
    if (isApiCall(url.pathname)) {
      return await networkFirst(request);
    }
    
    // Default - Network First
    return await networkFirst(request);
    
  } catch (error) {
    console.error('🔥 Request handling failed:', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Ultimate fallback
    return await createFallbackResponse(request);
  }
}

// Cache First strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('📦 Serving from cache:', request.url);
    return cachedResponse;
  }
  
  console.log('🌐 Fetching from network:', request.url);
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First strategy
async function networkFirst(request) {
  try {
    console.log('🌐 Trying network first:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error(`Network response not ok: ${networkResponse.status}`);
    
  } catch (error) {
    console.log('📦 Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Helper functions
function isStaticFile(pathname) {
  return STATIC_CACHE_URLS.includes(pathname) || 
         pathname.endsWith('.json') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.ico');
}

function isDynamicFile(pathname) {
  return DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(pathname));
}

function isApiCall(pathname) {
  return pathname.startsWith('/api/') || 
         pathname.includes('zukan') ||
         pathname.endsWith('.json');
}

// Fallback response for offline scenarios
async function createFallbackResponse(request) {
  const url = new URL(request.url);
  
  // For HTML requests, return offline page
  if (request.headers.get('accept')?.includes('text/html')) {
    return new Response(`
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>オフライン - ポケモン図鑑マスター</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              margin: 0; padding: 2rem; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; text-align: center; min-height: 100vh;
              display: flex; flex-direction: column; justify-content: center;
            }
            .container { max-width: 400px; margin: 0 auto; }
            .icon { font-size: 4rem; margin-bottom: 1rem; }
            h1 { font-size: 1.5rem; margin-bottom: 1rem; }
            p { margin-bottom: 2rem; opacity: 0.9; }
            button { 
              background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3);
              color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem;
              cursor: pointer; font-size: 1rem;
            }
            button:hover { background: rgba(255,255,255,0.3); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📡</div>
            <h1>オフライン状態です</h1>
            <p>インターネット接続を確認してください。<br>キャッシュされたデータで一部の機能は利用可能です。</p>
            <button onclick="window.location.reload()">再試行</button>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
  
  // For other requests, return basic error response
  return new Response('オフライン状態です', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

// Background sync for data updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'pokemon-data-sync') {
    console.log('🔄 Background sync: pokemon-data-sync');
    event.waitUntil(syncPokemonData());
  }
});

async function syncPokemonData() {
  try {
    console.log('📊 Syncing Pokemon data...');
    
    // Update cached data files
    const dataFiles = ['/paldea_zukan_data.json', '/galar_zukan_data.json'];
    const cache = await caches.open(CACHE_NAME);
    
    for (const file of dataFiles) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          await cache.put(file, response);
          console.log(`✅ Updated cache for ${file}`);
        }
      } catch (error) {
        console.log(`⚠️ Failed to update ${file}:`, error);
      }
    }
    
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'ポケモン図鑑マスターからの通知',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'pokemon-zukan',
    data: data.data || {}
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'ポケモン図鑑マスター',
      options
    )
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // フォーカス可能なクライアントがあればフォーカス
        for (const client of clientList) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        
        // なければ新しいウィンドウを開く
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
  );
});

console.log('🎮 Pokemon Zukan Master Service Worker loaded!');