
import { useState, useEffect, useCallback } from 'react';

interface ProgressiveLoadingOptions {
  preloadDelay?: number;
  prefetchOnHover?: boolean;
  prefetchOnIntersection?: boolean;
}

export function useProgressiveLoading(
  importFunc: () => Promise<{ default: React.ComponentType<any> }>,
  options: ProgressiveLoadingOptions = {}
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    preloadDelay = 0,
    prefetchOnHover = false,
    prefetchOnIntersection = false
  } = options;

  const loadComponent = useCallback(async () => {
    if (isLoaded || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await importFunc();
      setIsLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load component'));
    } finally {
      setIsLoading(false);
    }
  }, [importFunc, isLoaded, isLoading]);

  // Preload with delay
  useEffect(() => {
    if (preloadDelay > 0) {
      const timer = setTimeout(() => {
        loadComponent();
      }, preloadDelay);
      
      return () => clearTimeout(timer);
    }
  }, [preloadDelay, loadComponent]);

  // Prefetch on hover
  const prefetchHandlers = prefetchOnHover ? {
    onMouseEnter: loadComponent,
    onFocus: loadComponent
  } : {};

  // Intersection observer for prefetching
  const intersectionRef = useCallback((node: HTMLElement | null) => {
    if (!prefetchOnIntersection || !node) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadComponent();
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );
    
    observer.observe(node);
    
    return () => observer.disconnect();
  }, [prefetchOnIntersection, loadComponent]);

  return {
    isLoaded,
    isLoading,
    error,
    loadComponent,
    prefetchHandlers,
    intersectionRef
  };
}

// Hook for managing multiple lazy components
export function useMultipleProgressiveLoading(
  components: Record<string, () => Promise<{ default: React.ComponentType<any> }>>
) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [loadedStates, setLoadedStates] = useState<Record<string, boolean>>({});
  
  const loadComponent = useCallback(async (key: string) => {
    if (loadedStates[key] || loadingStates[key]) return;
    
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    try {
      await components[key]();
      setLoadedStates(prev => ({ ...prev, [key]: true }));
    } catch (error) {
      console.error(`Failed to load component ${key}:`, error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  }, [components, loadedStates, loadingStates]);

  const preloadAll = useCallback(() => {
    Object.keys(components).forEach(key => {
      loadComponent(key);
    });
  }, [components, loadComponent]);

  return {
    loadingStates,
    loadedStates,
    loadComponent,
    preloadAll
  };
}
