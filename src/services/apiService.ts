
import { supabase } from '@/integrations/supabase/client';
import { errorTracker } from './errorTracking';

interface SearchFilters {
  court?: string;
  department?: string;
  dateFrom?: string;
  dateTo?: string;
  keywords?: string[];
}

interface SearchResult {
  id: string;
  title: string;
  court: string;
  caseNumber: string;
  date: string;
  department: string;
  summary: string;
  keywords: string[];
  fullText?: string;
}

class APIService {
  async searchCases(query: string, filters: SearchFilters = {}, limit = 10): Promise<SearchResult[]> {
    const startTime = Date.now();
    
    try {
      let queryBuilder = supabase
        .from('legal_cases')
        .select('*')
        .limit(limit);

      // Add text search
      if (query.trim()) {
        queryBuilder = queryBuilder.textSearch('title,summary,full_text', query);
      }

      // Add filters
      if (filters.court) {
        queryBuilder = queryBuilder.eq('court', filters.court);
      }
      
      if (filters.department) {
        queryBuilder = queryBuilder.eq('department', filters.department);
      }

      if (filters.dateFrom) {
        queryBuilder = queryBuilder.gte('decision_date', filters.dateFrom);
      }

      if (filters.dateTo) {
        queryBuilder = queryBuilder.lte('decision_date', filters.dateTo);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        throw error;
      }

      errorTracker.trackPerformance('searchCases', startTime, { 
        query, 
        filters, 
        resultCount: data?.length || 0 
      });

      return data?.map(case_item => ({
        id: case_item.id,
        title: case_item.title,
        court: case_item.court,
        caseNumber: case_item.case_number,
        date: case_item.decision_date,
        department: case_item.department,
        summary: case_item.summary,
        keywords: case_item.keywords || [],
        fullText: case_item.full_text
      })) || [];

    } catch (error) {
      errorTracker.logError(error as Error, { 
        component: 'APIService',
        action: 'searchCases',
        metadata: { query, filters }
      });
      throw error;
    }
  }

  async getCaseById(id: string): Promise<SearchResult | null> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('legal_cases')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Case not found
        }
        throw error;
      }

      errorTracker.trackPerformance('getCaseById', startTime, { id });

      return {
        id: data.id,
        title: data.title,
        court: data.court,
        caseNumber: data.case_number,
        date: data.decision_date,
        department: data.department,
        summary: data.summary,
        keywords: data.keywords || [],
        fullText: data.full_text
      };

    } catch (error) {
      errorTracker.logError(error as Error, {
        component: 'APIService',
        action: 'getCaseById',
        metadata: { id }
      });
      throw error;
    }
  }

  async getSubscriptionPlans() {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price');

      if (error) {
        throw error;
      }

      errorTracker.trackPerformance('getSubscriptionPlans', startTime);

      return data?.map(plan => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        maxSearches: plan.max_searches,
        features: plan.features || [],
        popular: plan.is_popular || false
      })) || [];

    } catch (error) {
      errorTracker.logError(error as Error, {
        component: 'APIService',
        action: 'getSubscriptionPlans'
      });
      throw error;
    }
  }
}

export const apiService = new APIService();
