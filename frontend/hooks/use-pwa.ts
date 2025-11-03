/**
 * React hook for Service Worker management and PWA features
 */

import { useEffect, useState } from 'react';

export interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
}

export function usePWA() {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    isSupported: false,
    isRegistered: false,
    isOnline: navigator.onLine,
    updateAvailable: false,
  });

  useEffect(() => {
    // Check Service Worker support
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service Workers not supported');
      return;
    }

    setStatus((prev) => ({ ...prev, isSupported: true }));

    // Register Service Worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('[PWA] Service Worker registered:', registration.scope);
        setStatus((prev) => ({ ...prev, isRegistered: true }));

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              console.log('[PWA] New service worker available');
              setStatus((prev) => ({ ...prev, updateAvailable: true }));
            }
          });
        });

        // Periodic check for updates
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    };

    registerServiceWorker();

    // Monitor online/offline status
    const handleOnline = () => setStatus((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Trigger service worker update
   */
  const updateServiceWorker = () => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
        window.location.reload();
      });
    });
  };

  /**
   * Sync analytics when online
   */
  const syncAnalytics = async () => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      console.log('[PWA] Service Worker controller not available');
      return;
    }

    navigator.serviceWorker.controller.postMessage({
      type: 'FLUSH_ANALYTICS',
    });

    console.log('[PWA] Analytics sync requested');
  };

  /**
   * Request storage persistence
   */
  const requestPersistentStorage = async () => {
    if (!navigator.storage?.persist) {
      console.log('[PWA] Persistent storage not supported');
      return false;
    }

    try {
      const persistent = await navigator.storage.persist();
      console.log('[PWA] Persistent storage:', persistent ? 'granted' : 'denied');
      return persistent;
    } catch (error) {
      console.error('[PWA] Failed to request persistent storage:', error);
      return false;
    }
  };

  /**
   * Request notification permission
   */
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('[PWA] Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('[PWA] Failed to request notification permission:', error);
        return false;
      }
    }

    return false;
  };

  /**
   * Send notification
   */
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SEND_NOTIFICATION',
          title,
          options,
        });
      } else {
        new Notification(title, options);
      }
    }
  };

  return {
    ...status,
    updateServiceWorker,
    syncAnalytics,
    requestPersistentStorage,
    requestNotificationPermission,
    sendNotification,
  };
}
