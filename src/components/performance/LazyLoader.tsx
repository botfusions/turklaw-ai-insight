
import { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface LazyLoaderProps {
  importFunc: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: Record<string, any>;
}

export function LazyLoader({ importFunc, fallback, props = {} }: LazyLoaderProps) {
  const LazyComponent = lazy(importFunc);
  
  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size="md" message="Bileşen yükleniyor..." />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Higher-order component for easy lazy loading
export function withLazyLoading<T extends Record<string, any>>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  return function LazyWrappedComponent(props: T) {
    return (
      <LazyLoader
        importFunc={importFunc}
        fallback={fallback}
        props={props}
      />
    );
  };
}

// Pre-configured lazy loaders for common components
export const LazyDashboard = () => import('@/pages/Dashboard');
export const LazySearchPage = () => import('@/pages/SearchPage');
export const LazyProfile = () => import('@/pages/Profile');
export const LazySavedCases = () => import('@/pages/SavedCases');
