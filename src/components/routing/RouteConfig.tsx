
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RouteProtectionLevel } from '@/types/routes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
// Removed unnecessary lazy loader imports since we use direct React.lazy

// Critical Pages - Eager Import (needed for initial load)
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import EmailVerification from '@/pages/EmailVerification';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';

// Direct lazy imports - correct syntax
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const SearchPage = React.lazy(() => import('@/pages/SearchPage'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const SavedCases = React.lazy(() => import('@/pages/SavedCases'));
const Subscription = React.lazy(() => import('@/pages/Subscription'));
const MevzuatExample = React.lazy(() => import('@/pages/MevzuatExample'));
const About = React.lazy(() => import('@/pages/About'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const Pricing = React.lazy(() => import('@/pages/Pricing'));
const HybridSearch = React.lazy(() => import('@/pages/HybridSearch'));

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
        element={<Index />} 
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
          <Suspense fallback={<RouteLoadingFallback message="Dashboard hazırlanıyor..." />}>
            <ProtectedRoute protection={RouteProtectionLevel.AUTHENTICATED}>
              <Dashboard />
            </ProtectedRoute>
          </Suspense>
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

      <Route 
        path="/hybrid-search" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.PUBLIC}>
            <Suspense fallback={<RouteLoadingFallback message="Hibrit Arama yükleniyor..." />}>
              <HybridSearch />
            </Suspense>
          </ProtectedRoute>
        } 
      />

      {/* Catch-all route - Critical */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
