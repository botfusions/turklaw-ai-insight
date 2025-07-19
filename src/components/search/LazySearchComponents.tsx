
import { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Lazy load heavy search components
const LazyCategorySidebar = lazy(() => import('@/components/search/CategorySidebar').then(module => ({ default: module.CategorySidebar })));
const LazySearchContent = lazy(() => import('@/components/search/SearchContent').then(module => ({ default: module.SearchContent })));

// Component loading fallbacks
const CategorySidebarLoadingFallback = () => (
  <div className="w-80 bg-background border-r flex items-center justify-center p-4">
    <LoadingSpinner size="sm" message="Kategoriler yükleniyor..." />
  </div>
);

const SearchContentLoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center p-8">
    <LoadingSpinner size="md" message="Arama içeriği hazırlanıyor..." />
  </div>
);

// Wrapper components with lazy loading
export function CategorySidebarLazy(props: any) {
  return (
    <Suspense fallback={<CategorySidebarLoadingFallback />}>
      <LazyCategorySidebar {...props} />
    </Suspense>
  );
}

export function SearchContentLazy(props: any) {
  return (
    <Suspense fallback={<SearchContentLoadingFallback />}>
      <LazySearchContent {...props} />
    </Suspense>
  );
}

// Preloading functions for search components
export const preloadSearchComponents = () => {
  // Preload category sidebar when search page loads
  import('@/components/search/CategorySidebar');
  
  // Preload search content components
  import('@/components/search/SearchContent');
};
