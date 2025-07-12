import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useScrollEffect } from './useScrollEffect';

export function useHeader() {
  const { user, profile, signOut, loading } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const { scrolled, scrollDirection } = useScrollEffect({ threshold: 20 });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  // Header görünürlüğü - scroll down'da gizle, up'ta göster
  const isHeaderVisible = scrollDirection === 'up' || !scrolled;

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const toggleNotifications = useCallback(() => {
    setNotificationsPanelOpen(prev => !prev);
  }, []);

  const closeNotifications = useCallback(() => {
    setNotificationsPanelOpen(false);
  }, []);

  // Kullanıcı bilgileri
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';
  const userInitials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // Arama istatistikleri
  const searchStats = profile ? {
    used: profile.monthly_search_count,
    total: profile.max_searches,
    percentage: Math.round((profile.monthly_search_count / profile.max_searches) * 100),
    isLimitReached: profile.monthly_search_count >= profile.max_searches,
  } : null;

  return {
    // Auth state
    user,
    profile,
    signOut,
    loading,
    displayName,
    userInitials,
    
    // Search stats
    searchStats,
    
    // Notifications
    notifications,
    unreadCount,
    notificationsPanelOpen,
    toggleNotifications,
    closeNotifications,
    
    // Mobile menu
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    
    // Scroll effects
    scrolled,
    scrollDirection,
    isHeaderVisible,
  };
}