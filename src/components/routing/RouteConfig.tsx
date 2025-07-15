import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RouteProtectionLevel } from '@/types/routes';

// Essential Pages Only
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import EmailVerification from '@/pages/EmailVerification';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Search from '@/pages/Search';
import SavedCases from '@/pages/SavedCases';
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

      {/* Essential Authenticated Routes Only */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute 
            protection={RouteProtectionLevel.AUTHENTICATED}
          >
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Profile Route */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute 
            protection={RouteProtectionLevel.AUTHENTICATED}
          >
            <Profile />
          </ProtectedRoute>
        } 
      />

      {/* Search Route */}
      <Route 
        path="/search" 
        element={
          <ProtectedRoute 
            protection={RouteProtectionLevel.AUTHENTICATED}
            requiresSearchLimit={true}
          >
            <Search />
          </ProtectedRoute>
        } 
      />

      {/* Saved Cases Route */}
      <Route 
        path="/saved-cases" 
        element={
          <ProtectedRoute 
            protection={RouteProtectionLevel.AUTHENTICATED}
          >
            <SavedCases />
          </ProtectedRoute>
        } 
      />

      {/* Subscription Route */}
      <Route 
        path="/subscription" 
        element={
          <ProtectedRoute 
            protection={RouteProtectionLevel.AUTHENTICATED}
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