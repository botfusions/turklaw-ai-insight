
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);

// Service Worker Registration - Fixed for production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Update service worker when new version is available
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show refresh notification
                if (confirm('Yeni sürüm mevcut! Sayfayı yenilemek ister misiniz?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('SW registration failed: ', error);
      });
  });
}

// Clear problematic caches on startup
if ('caches' in window) {
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      if (cacheName.includes('v1')) {
        console.log('Clearing old cache:', cacheName);
        caches.delete(cacheName);
      }
    });
  });
}

// Debug utilities for console (only in development)
if (import.meta.env.DEV) {
  // @ts-ignore
  window.debugTurkLawAI = {
    clearCaches: async () => {
      const { clearAllCaches } = await import('./utils/serviceWorkerUtils');
      return clearAllCaches();
    },
    forceRefresh: async () => {
      const { forceRefresh } = await import('./utils/serviceWorkerUtils');
      return forceRefresh();
    },
    debugCache: async () => {
      const { debugCacheStatus } = await import('./utils/serviceWorkerUtils');
      return debugCacheStatus();
    }
  };
  console.log('🔧 Debug utilities available: window.debugTurkLawAI');
}
