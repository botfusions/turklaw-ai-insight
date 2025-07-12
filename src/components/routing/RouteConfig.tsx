import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RouteProtectionLevel } from '@/types/routes';

// Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import EmailVerification from '@/pages/EmailVerification';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import SavedCases from '@/pages/SavedCases';
import Search from '@/pages/Search';
import Subscription from '@/pages/Subscription';
import NotFound from '@/pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.PUBLIC}>
            <Landing />
          </ProtectedRoute>
        } 
      />

      {/* Guest Only Routes */}
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

      {/* Email Verification - Authenticated but special case */}
      <Route 
        path="/verify-email" 
        element={
          <ProtectedRoute protection={RouteProtectionLevel.AUTHENTICATED}>
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

      {/* Authenticated Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute 
            protection={RouteProtectionLevel.AUTHENTICATED}
            requiresEmailVerification={true}
          >
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute 
            protection={RouteProtectionLevel.AUTHENTICATED}
            requiresEmailVerification={true}
          >
            <Profile />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/saved-cases" 
        element={
          <ProtectedRoute 
            protection={RouteProtectionLevel.AUTHENTICATED}
            requiresEmailVerification={true}
          >
            <SavedCases />
          </ProtectedRoute>
        } 
      />

      {/* Search with limit check */}
      <Route 
        path="/search" 
        element={
          <ProtectedRoute 
            protection={RouteProtectionLevel.AUTHENTICATED}
            requiresEmailVerification={true}
            requiresSearchLimit={true}
          >
            <Search />
          </ProtectedRoute>
        } 
      />

      {/* Subscription management */}
      <Route 
        path="/subscription" 
        element={
          <ProtectedRoute 
            protection={RouteProtectionLevel.AUTHENTICATED}
            requiresEmailVerification={true}
          >
            <Subscription />
          </ProtectedRoute>
        } 
      />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};