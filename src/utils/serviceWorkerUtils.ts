// Service Worker Utilities
export const clearAllCaches = async (): Promise<void> => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log('Clearing cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
      console.log('All caches cleared successfully');
    } catch (error) {
      console.error('Error clearing caches:', error);
    }
  }
};

export const unregisterServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => {
          console.log('Unregistering service worker:', registration);
          return registration.unregister();
        })
      );
      console.log('All service workers unregistered');
    } catch (error) {
      console.error('Error unregistering service workers:', error);
    }
  }
};

export const forceRefresh = async (): Promise<void> => {
  await clearAllCaches();
  await unregisterServiceWorker();
  window.location.reload();
};

// Debug function to check cache status
export const debugCacheStatus = async (): Promise<void> => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    console.log('Current caches:', cacheNames);
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      console.log(`Cache ${cacheName} contains ${keys.length} entries:`, keys.map(k => k.url));
    }
  }
  
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log('Service worker registrations:', registrations);
  }
};