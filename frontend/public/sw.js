/**
 * Service Worker for PWA Support
 * Handles caching, offline support, and background sync
 */

const CACHE_NAME = 'museum-app-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/explore',
  '/artwork',
  '/museum-map',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache-first strategy for assets, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests - network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static assets - cache first, fallback to network
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Default - network first
  event.respondWith(networkFirstStrategy(request));
});

/**
 * Cache-first strategy: Try cache first, fall back to network
 */
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
      console.log('[ServiceWorker] Cache hit:', request.url);
      return cached;
    }

    const response = await fetch(request);

    if (response.ok && isStaticAsset(new URL(request.url).pathname)) {
      const clone = response.clone();
      cache.put(request, clone);
    }

    return response;
  } catch (error) {
    console.error('[ServiceWorker] Cache-first error:', error);
    return new Response('Offline - resource not available', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

/**
 * Network-first strategy: Try network first, fall back to cache
 */
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      const clone = response.clone();
      cache.put(request, clone);
    }

    return response;
  } catch (error) {
    console.error('[ServiceWorker] Network error:', error);

    // Fall back to cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // Return offline response
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Offline - network unavailable',
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Check if URL is a static asset
 */
function isStaticAsset(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff2'];
  return staticExtensions.some((ext) => pathname.endsWith(ext));
}

// Message handler for background sync
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'FLUSH_ANALYTICS') {
    console.log('[ServiceWorker] Flushing cached analytics');
    // Analytics sync will be handled by the client
  }
});

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  try {
    const db = await openAnalyticsDB();
    const events = await getAllPendingEvents(db);

    if (events.length === 0) {
      return;
    }

    console.log('[ServiceWorker] Syncing', events.length, 'analytics events');

    const response = await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events,
        synced: true,
      }),
    });

    if (response.ok) {
      await clearPendingEvents(db);
      console.log('[ServiceWorker] Analytics synced successfully');
    }
  } catch (error) {
    console.error('[ServiceWorker] Analytics sync error:', error);
    throw error; // Retry sync
  }
}

/**
 * IndexedDB helpers for analytics persistence
 */
function openAnalyticsDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('museum-analytics', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('events')) {
        db.createObjectStore('events', { autoIncrement: true });
      }
    };
  });
}

async function getAllPendingEvents(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('events', 'readonly');
    const store = transaction.objectStore('events');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function clearPendingEvents(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('events', 'readwrite');
    const store = transaction.objectStore('events');
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
