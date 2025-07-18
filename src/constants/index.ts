
export const APP_CONFIG = {
  name: 'TurkLaw AI',
  version: '1.0.0',
  description: 'AI-powered Turkish legal case search and analysis platform',
  author: 'TurkLaw Team',
  
  // Search Configuration
  search: {
    defaultLimit: 10,
    maxLimit: 100,
    debounceMs: 300,
    minQueryLength: 2
  },

  // Performance Configuration
  performance: {
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  },

  // UI Configuration
  ui: {
    cardAnimationDuration: 200,
    toastDuration: 5000,
    loadingSpinnerDelay: 500
  }
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
} as const;

export const API_ENDPOINTS = {
  CASES: '/api/cases',
  SEARCH: '/api/search',
  USERS: '/api/users',
  SUBSCRIPTIONS: '/api/subscriptions'
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.',
  UNAUTHORIZED: 'Bu işlem için giriş yapmanız gerekiyor.',
  FORBIDDEN: 'Bu işlemi gerçekleştirme yetkiniz bulunmuyor.',
  NOT_FOUND: 'Aradığınız kaynak bulunamadı.',
  VALIDATION_ERROR: 'Girilen bilgiler geçersiz.',
  SERVER_ERROR: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
  SEARCH_FAILED: 'Arama işlemi başarısız. Lütfen tekrar deneyin.',
  CASE_NOT_FOUND: 'Belirtilen dava kaydı bulunamadı.'
} as const;

export const SUCCESS_MESSAGES = {
  SEARCH_COMPLETED: 'Arama başarıyla tamamlandı.',
  CASE_SAVED: 'Dava başarıyla kaydedildi.',
  PROFILE_UPDATED: 'Profil bilgileri güncellendi.',
  SUBSCRIPTION_UPDATED: 'Abonelik planı güncellendi.'
} as const;
