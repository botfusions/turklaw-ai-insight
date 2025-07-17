export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'basic' | 'premium';
  createdAt: Date;
}

export interface LegalCase {
  id: string;
  title: string;
  court: string;
  date: string;
  caseNumber: string;
  department: string;
  summary: string;
  fullText: string;
  keywords: string[];
}

export interface SearchFilters {
  court: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  caseNumber: string;
  department: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  features: string[];
  maxSearches: number;
  popular?: boolean;
}