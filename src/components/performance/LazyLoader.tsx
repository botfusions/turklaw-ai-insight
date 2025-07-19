
import { Suspense, lazy, ComponentType } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface LazyLoaderProps {
  importFunc: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: Record<string, any>;
  loadingMessage?: string;
}

export function LazyLoader({ 
  importFunc, 
  fallback, 
  props = {}, 
  loadingMessage = "Yükleniyor..." 
}: LazyLoaderProps) {
  const LazyComponent = lazy(importFunc);
  
  const defaultFallback = (
    <div className="flex items-center justify-center min-h-[200px] p-8">
      <LoadingSpinner size="md" message={loadingMessage} />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Higher-order component for easy lazy loading with better performance
export function withLazyLoading<T extends Record<string, any>>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode,
  loadingMessage?: string
) {
  return function LazyWrappedComponent(props: T) {
    return (
      <LazyLoader
        importFunc={importFunc}
        fallback={fallback}
        props={props}
        loadingMessage={loadingMessage}
      />
    );
  };
}

// Optimized lazy loaders for common components with specific loading messages
export const LazyDashboard = () => import('@/pages/Dashboard').then(module => ({ default: module.default }));
export const LazySearchPage = () => import('@/pages/SearchPage').then(module => ({ default: module.default }));
export const LazyProfile = () => import('@/pages/Profile');
export const LazySavedCases = () => import('@/pages/SavedCases');
export const LazySubscription = () => import('@/pages/Subscription');
export const LazyMevzuatExample = () => import('@/pages/MevzuatExample');
export const LazyAbout = () => import('@/pages/About');
export const LazyContact = () => import('@/pages/Contact');
export const LazyPricing = () => import('@/pages/Pricing');

// Component-level lazy loaders for heavy dashboard components
export const LazyDashboardSidebar = () => import('@/components/dashboard/DashboardSidebar');
export const LazySearchResults = () => import('@/components/dashboard/SearchResults');
export const LazyAnalyticsChart = () => import('@/components/dashboard/AnalyticsChart');
export const LazyCategorySidebar = () => import('@/components/search/CategorySidebar');

// Preloading utility function
export const preloadComponent = (importFunc: () => Promise<{ default: ComponentType<any> }>) => {
  const componentImport = importFunc();
  return componentImport;
};

// Prefetch on hover utility
export const usePrefetchOnHover = (importFunc: () => Promise<{ default: ComponentType<any> }>) => {
  let prefetched = false;
  
  const handleMouseEnter = () => {
    if (!prefetched) {
      prefetched = true;
      importFunc();
    }
  };
  
  return { onMouseEnter: handleMouseEnter };
};
