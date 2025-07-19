
import { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Lazy load heavy dashboard components
const LazyDashboardSidebar = lazy(() => import('@/components/dashboard/DashboardSidebar'));
const LazySearchResults = lazy(() => import('@/components/dashboard/SearchResults'));
const LazyAnalyticsChart = lazy(() => import('@/components/dashboard/AnalyticsChart'));

// Component loading fallbacks
const SidebarLoadingFallback = () => (
  <div className="w-80 bg-background border-r flex items-center justify-center p-4">
    <LoadingSpinner size="sm" message="Yan panel yükleniyor..." />
  </div>
);

const SearchResultsLoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center p-8">
    <LoadingSpinner size="md" message="Arama sonuçları hazırlanıyor..." />
  </div>
);

const AnalyticsLoadingFallback = () => (
  <div className="h-64 bg-card rounded-lg border flex items-center justify-center">
    <LoadingSpinner size="sm" message="Analitik verileri yükleniyor..." />
  </div>
);

// Wrapper components with lazy loading
export function DashboardSidebarLazy(props: any) {
  return (
    <Suspense fallback={<SidebarLoadingFallback />}>
      <LazyDashboardSidebar {...props} />
    </Suspense>
  );
}

export function SearchResultsLazy(props: any) {
  return (
    <Suspense fallback={<SearchResultsLoadingFallback />}>
      <LazySearchResults {...props} />
    </Suspense>
  );
}

export function AnalyticsChartLazy(props: any) {
  return (
    <Suspense fallback={<AnalyticsLoadingFallback />}>
      <LazyAnalyticsChart {...props} />
    </Suspense>
  );
}

// Preloading functions for better UX
export const preloadDashboardComponents = () => {
  // Preload sidebar when user is likely to open it
  import('@/components/dashboard/DashboardSidebar');
  
  // Preload search results component
  import('@/components/dashboard/SearchResults');
  
  // Preload analytics after initial load
  setTimeout(() => {
    import('@/components/dashboard/AnalyticsChart');
  }, 1000);
};
