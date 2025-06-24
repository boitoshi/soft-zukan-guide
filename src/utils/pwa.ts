/**
 * PWA utility functions
 * Service Worker registration and PWA install prompt
 */

// Service Worker registration
export async function registerServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    console.log('📱 Service Worker not supported');
    return false;
  }

  try {
    console.log('🚀 Registering Service Worker...');
    
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('✅ Service Worker registered:', registration);

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      console.log('🔄 Service Worker update found');
      
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('🆕 New content available, please refresh');
              showUpdateNotification();
            } else {
              console.log('✨ Content cached for offline use');
            }
          }
        });
      }
    });

    return true;

  } catch (error) {
    console.error('❌ Service Worker registration failed:', error);
    return false;
  }
}

// Update notification
function showUpdateNotification(): void {
  // Create a simple notification
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed; 
      top: 20px; 
      right: 20px; 
      background: #4f46e5; 
      color: white; 
      padding: 1rem; 
      border-radius: 0.5rem; 
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 10000;
      max-width: 300px;
    ">
      <div style="font-weight: bold; margin-bottom: 0.5rem;">🆕 アップデート利用可能</div>
      <div style="font-size: 0.9rem; margin-bottom: 1rem;">新しい機能が利用可能です</div>
      <button onclick="window.location.reload()" style="
        background: white; 
        color: #4f46e5; 
        border: none; 
        padding: 0.5rem 1rem; 
        border-radius: 0.25rem; 
        cursor: pointer;
        margin-right: 0.5rem;
      ">更新</button>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: transparent; 
        color: white; 
        border: 1px solid rgba(255,255,255,0.3); 
        padding: 0.5rem 1rem; 
        border-radius: 0.25rem; 
        cursor: pointer;
      ">後で</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 10 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 10000);
}

// PWA install prompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function initializePWAInstall(): void {
  // Listen for install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 PWA install prompt available');
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    showInstallButton();
  });

  // Listen for app installed
  window.addEventListener('appinstalled', () => {
    console.log('🎉 PWA installed successfully');
    hideInstallButton();
    deferredPrompt = null;
  });
}

// Show install button
function showInstallButton(): void {
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
}

// Hide install button
function hideInstallButton(): void {
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'none';
  }
}

// Trigger PWA install
export async function installPWA(): Promise<boolean> {
  if (!deferredPrompt) {
    console.log('📱 PWA install not available');
    return false;
  }

  try {
    console.log('🚀 Showing PWA install prompt...');
    await deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`📱 PWA install ${outcome}`);
    
    deferredPrompt = null;
    return outcome === 'accepted';

  } catch (error) {
    console.error('❌ PWA install failed:', error);
    return false;
  }
}

// Check if app is running as PWA
export function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true ||
         document.referrer.includes('android-app://');
}

// Background sync registration
export async function registerBackgroundSync(tag: string): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('sync' in (window as any).ServiceWorkerRegistration.prototype)) {
    console.log('📱 Background Sync not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await (registration as any).sync.register(tag);
    console.log(`🔄 Background sync registered: ${tag}`);
    return true;

  } catch (error) {
    console.error('❌ Background sync registration failed:', error);
    return false;
  }
}

// Cache size management
export async function getCacheSize(): Promise<{ name: string; size: number }[]> {
  if (!('caches' in window)) {
    return [];
  }

  try {
    const cacheNames = await caches.keys();
    const cacheSizes = await Promise.all(
      cacheNames.map(async (name) => {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        
        let size = 0;
        for (const key of keys) {
          const response = await cache.match(key);
          if (response) {
            const blob = await response.blob();
            size += blob.size;
          }
        }
        
        return { name, size };
      })
    );

    return cacheSizes;

  } catch (error) {
    console.error('❌ Cache size calculation failed:', error);
    return [];
  }
}

// Clear all caches
export async function clearAllCaches(): Promise<boolean> {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('🗑️ All caches cleared');
    return true;

  } catch (error) {
    console.error('❌ Cache clearing failed:', error);
    return false;
  }
}