
import { Database } from '@/integrations/supabase/types';

// Extended types for better type safety
export type Tables = Database['public']['Tables'];
export type Profile = Tables['profiles']['Row'];
export type ProfileInsert = Tables['profiles']['Insert'];
export type ProfileUpdate = Tables['profiles']['Update'];

export type LegalCase = Tables['legal_cases']['Row'];
export type SavedCase = Tables['saved_cases']['Row'];
export type SavedCaseInsert = Tables['saved_cases']['Insert'];

export type UserSearch = Tables['user_searches']['Row'];
export type UserSearchInsert = Tables['user_searches']['Insert'];

export type Notification = Tables['notifications']['Row'];
export type NotificationInsert = Tables['notifications']['Insert'];
export type NotificationUpdate = Tables['notifications']['Update'];

export type SubscriptionPlan = Tables['subscription_plans']['Row'];
export type UserSubscription = Tables['user_subscriptions']['Row'];
export type UserSubscriptionInsert = Tables['user_subscriptions']['Insert'];

export type SavedSearch = Tables['saved_searches']['Row'];
export type SavedSearchInsert = Tables['saved_searches']['Insert'];

export type SearchSuggestion = Tables['search_suggestions']['Row'];

// Common query filters
export interface DatabaseFilters {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
}

export interface CaseFilters extends DatabaseFilters {
  court?: string;
  department?: string;
  dateFrom?: string;
  dateTo?: string;
  keywords?: string[];
}
