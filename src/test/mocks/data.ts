import { LegalCase, SubscriptionPlan } from '@/types';
import { Profile } from '@/types/auth';

export const mockUser = {
  id: 'mock-user-id',
  email: 'test@example.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  confirmation_sent_at: null,
  recovery_sent_at: null,
  email_change_sent_at: null,
  new_email: null,
  invited_at: null,
  action_link: null,
  email_confirmed_at: new Date().toISOString(),
  phone_confirmed_at: null,
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  phone: null,
  email_change: null,
  email_change_confirm_status: 0,
  banned_until: null,
  deleted_at: null,
  is_anonymous: false,
};

export const mockProfile: Profile = {
  id: 'mock-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  plan: 'basic',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockLegalCase: LegalCase = {
  id: 'mock-case-id',
  title: 'Test Legal Case',
  court: 'Test Court',
  caseNumber: 'TEST-001',
  date: '2024-01-01',
  department: 'Test Department',
  summary: 'Test summary for legal case',
  keywords: ['test', 'case', 'legal'],
  fullText: 'This is a test legal case with full text content.',
};

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 850,
    originalPrice: 1700,
    currency: 'TL',
    maxSearches: 50,
    features: ['Sınırsız arama', 'Temel karar özeti', 'PDF indirme', 'E-posta desteği'],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 5500,
    originalPrice: 11000,
    currency: 'TL',
    maxSearches: 250,
    features: ['Sınırsız arama', 'Tüm mahkemeler', 'Gelişmiş filtreleme', 'Tam metin erişimi', 'AI destekli analiz'],
    popular: true,
  },
];

export const mockSavedCase = {
  id: 'mock-saved-case-id',
  user_id: 'mock-user-id',
  case_id: 'mock-case-id',
  notes: 'Test notes for saved case',
  saved_at: new Date().toISOString(),
};

export const mockSearchHistory = [
  {
    id: 'mock-search-1',
    user_id: 'mock-user-id',
    query: 'test search query',
    filters: { court: 'Test Court' },
    results_count: 5,
    search_date: new Date().toISOString(),
  },
  {
    id: 'mock-search-2',
    user_id: 'mock-user-id',
    query: 'another search',
    filters: { department: 'Test Department' },
    results_count: 3,
    search_date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
];