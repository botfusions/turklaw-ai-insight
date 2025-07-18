
import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'medium',
  reducedMotion: false,
  screenReaderMode: false,
  keyboardNavigation: true
};

export function useAccessibility() {
  const [settings, setSettings] = useLocalStorage<AccessibilitySettings>(
    'accessibility-settings', 
    defaultSettings
  );
  const [systemPreferences, setSystemPreferences] = useState({
    prefersDarkMode: false,
    prefersReducedMotion: false,
    prefersHighContrast: false
  });

  // Detect system preferences
  useEffect(() => {
    const detectPreferences = () => {
      setSystemPreferences({
        prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches
      });
    };

    detectPreferences();

    // Listen for changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    darkModeQuery.addEventListener('change', detectPreferences);
    reducedMotionQuery.addEventListener('change', detectPreferences);
    highContrastQuery.addEventListener('change', detectPreferences);

    return () => {
      darkModeQuery.removeEventListener('change', detectPreferences);
      reducedMotionQuery.removeEventListener('change', detectPreferences);
      highContrastQuery.removeEventListener('change', detectPreferences);
    };
  }, []);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;

    // High contrast mode
    if (settings.highContrast || systemPreferences.prefersHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size
    root.style.setProperty('--accessibility-font-scale', getFontScale(settings.fontSize));

    // Reduced motion
    if (settings.reducedMotion || systemPreferences.prefersReducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Screen reader mode
    if (settings.screenReaderMode) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }

  }, [settings, systemPreferences]);

  const getFontScale = (size: AccessibilitySettings['fontSize']) => {
    switch (size) {
      case 'small': return '0.875';
      case 'medium': return '1';
      case 'large': return '1.125';
      case 'extra-large': return '1.25';
      default: return '1';
    }
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return {
    settings,
    systemPreferences,
    updateSetting,
    resetSettings,
    announceToScreenReader,
    isHighContrast: settings.highContrast || systemPreferences.prefersHighContrast,
    isReducedMotion: settings.reducedMotion || systemPreferences.prefersReducedMotion,
    fontSize: settings.fontSize,
    isScreenReaderMode: settings.screenReaderMode
  };
}
