
// Subscription Plans
export const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 850,
    originalPrice: 1700,
    popular: false,
    features: [
      '50 arama/ay',
      'Temel karar özeti',
      'PDF indirme',
      'E-posta desteği',
      '7 gün ücretsiz deneme'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2750,
    originalPrice: 5500,
    popular: true,
    features: [
      '250 arama/ay',
      'Detaylı AI analizi',
      'Gelişmiş filtreleme',
      'Tam metin erişimi',
      'Benzer karar önerileri',
      'Özel notlar',
      'İstatistikler',
      'Öncelikli destek',
      '7 gün ücretsiz deneme'
    ]
  }
];

// Mock User Data
export const mockUser = {
  id: 'mock-user-id',
  email: 'test@example.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Mock Profile Data
export const mockProfile = {
  id: 'mock-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  plan: 'premium',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Application Configuration
export const APP_CONFIG = {
  name: 'TurkLaw AI',
  description: 'AI Destekli Hukuk Araştırma Platformu'
};

// Application Constants
export const APP_NAME = 'TurkLaw AI';
export const APP_DESCRIPTION = 'AI Destekli Hukuk Araştırma Platformu';

// Default Limits
export const DEFAULT_SEARCH_LIMIT = 50;
export const PREMIUM_SEARCH_LIMIT = 250;

// Contact Information
export const CONTACT_EMAIL = 'info@turklaw.ai';
export const SUPPORT_EMAIL = 'destek@turklaw.ai';
