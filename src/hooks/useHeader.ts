
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';
import { useScrollEffect } from './useScrollEffect';

export function useHeader() {
  try {
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

    return {
      // Auth state
      user,
      profile,
      signOut,
      loading,
      displayName,
      userInitials,
      
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
  } catch (error) {
    console.warn('useHeader error:', error);
    // Return safe defaults
    return {
      user: null,
      profile: null,
      signOut: () => {},
      loading: false,
      displayName: 'Kullanıcı',
      userInitials: 'KU',
      notifications: [],
      unreadCount: 0,
      notificationsPanelOpen: false,
      toggleNotifications: () => {},
      closeNotifications: () => {},
      mobileMenuOpen: false,
      toggleMobileMenu: () => {},
      closeMobileMenu: () => {},
      scrolled: false,
      scrollDirection: 'up' as const,
      isHeaderVisible: true,
    };
  }
}
