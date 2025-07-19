
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RouteProtectionLevel } from '@/types/routes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  LazyDashboard,
  LazySearchPage,
  LazyProfile,
  LazySavedCases,
  LazySubscription,
  LazyMevzuatExample,
  LazyAbout,
  LazyContact,
  LazyPricing,
  withLazyLoading
} from '@/components/performance/LazyLoader';

// Critical Pages - Eager Import (needed for initial load)
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import EmailVerification from '@/pages/EmailVerification';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';

// Direct lazy imports - no double wrapping
const Dashboard = React.lazy(LazyDashboard);
const SearchPage = React.lazy(LazySearchPage);
const Profile = React.lazy(LazyProfile);
const SavedCases = React.lazy(LazySavedCases);
const Subscription = React.lazy(LazySubscription);
const MevzuatExample = React.lazy(LazyMevzuatExample);
const About = React.lazy(LazyAbout);
const Contact = React.lazy(LazyContact);
const Pricing = React.lazy(LazyPricing);

// Custom loading fallback for route-level loading
const RouteLoadingFallback = ({ message }: { message?: string }) => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <LoadingSpinner size="lg" message={message || "Sayfa yükleniyor..."} />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Critical Routes - Eager Loading */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.PUBLIC}>
            <Landing />
          </ProtectedRoute>
        } 
      />

      {/* Auth Routes - Critical for user flow */}
      <Route 
        path="/login" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.GUEST_ONLY}>
            <Login />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.GUEST_ONLY}>
            <Register />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.GUEST_ONLY}>
            <ForgotPassword />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/email-verification" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.PUBLIC}>
            <EmailVerification />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reset-password" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.AUTHENTICATED}>
            <ResetPassword />
          </ProtectedRoute>
        } 
      />

      {/* Non-Critical Routes - Lazy Loading */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.AUTHENTICATED}>
            <Suspense fallback={<RouteLoadingFallback message="Dashboard hazırlanıyor..." />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/search" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.AUTHENTICATED}>
            <Suspense fallback={<RouteLoadingFallback message="Arama sayfası yükleniyor..." />}>
              <SearchPage />
            </Suspense>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.AUTHENTICATED}>
            <Suspense fallback={<RouteLoadingFallback message="Profil sayfası yükleniyor..." />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/saved-cases" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.AUTHENTICATED}>
            <Suspense fallback={<RouteLoadingFallback message="Kaydedilen davalar yükleniyor..." />}>
              <SavedCases />
            </Suspense>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/subscription" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.AUTHENTICATED}>
            <Suspense fallback={<RouteLoadingFallback message="Abonelik yönetimi yükleniyor..." />}>
              <Subscription />
            </Suspense>
          </ProtectedRoute>
        } 
      />

      {/* Public Non-Critical Routes - Lazy Loading */}
      <Route 
        path="/mevzuat-example" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.PUBLIC}>
            <Suspense fallback={<RouteLoadingFallback message="Mevzuat örneği yükleniyor..." />}>
              <MevzuatExample />
            </Suspense>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/about" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.PUBLIC}>
            <Suspense fallback={<RouteLoadingFallback message="Hakkımızda sayfası yükleniyor..." />}>
              <About />
            </Suspense>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/contact" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.PUBLIC}>
            <Suspense fallback={<RouteLoadingFallback message="İletişim sayfası yükleniyor..." />}>
              <Contact />
            </Suspense>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/pricing" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.PUBLIC}>
            <Suspense fallback={<RouteLoadingFallback message="Fiyatlandırma yükleniyor..." />}>
              <Pricing />
            </Suspense>
          </ProtectedRoute>
        } 
      />

      {/* Catch-all route - Critical */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
