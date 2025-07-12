import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SmartRedirectState } from '@/types/routes';

const REDIRECT_STORAGE_KEY = 'turklaw_intended_route';
const REDIRECT_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const useSmartRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const saveIntendedRoute = (path: string) => {
    const redirectState: SmartRedirectState = {
      intendedRoute: path,
      timestamp: Date.now()
    };
    localStorage.setItem(REDIRECT_STORAGE_KEY, JSON.stringify(redirectState));
  };

  const getIntendedRoute = (): string | null => {
    try {
      const stored = localStorage.getItem(REDIRECT_STORAGE_KEY);
      if (!stored) return null;

      const redirectState: SmartRedirectState = JSON.parse(stored);
      
      // Check if redirect has expired
      if (Date.now() - redirectState.timestamp > REDIRECT_EXPIRY) {
        localStorage.removeItem(REDIRECT_STORAGE_KEY);
        return null;
      }

      return redirectState.intendedRoute || null;
    } catch {
      localStorage.removeItem(REDIRECT_STORAGE_KEY);
      return null;
    }
  };

  const clearIntendedRoute = () => {
    localStorage.removeItem(REDIRECT_STORAGE_KEY);
  };

  const redirectToIntended = (fallback = '/dashboard') => {
    const intendedRoute = getIntendedRoute();
    clearIntendedRoute();
    navigate(intendedRoute || fallback, { replace: true });
  };

  return {
    saveIntendedRoute,
    getIntendedRoute,
    clearIntendedRoute,
    redirectToIntended
  };
};