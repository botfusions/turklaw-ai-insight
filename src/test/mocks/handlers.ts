import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock Supabase auth endpoints
  http.post('*/auth/v1/signup', () => {
    return HttpResponse.json({
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: {
          id: 'mock-user-id',
          email: 'test@example.com',
        },
      },
    });
  }),

  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
      },
    });
  }),

  http.post('*/auth/v1/logout', () => {
    return HttpResponse.json({});
  }),

  http.post('*/auth/v1/recover', () => {
    return HttpResponse.json({});
  }),

  // Mock Supabase REST API endpoints
  http.get('*/rest/v1/profiles', () => {
    return HttpResponse.json([
      {
        id: 'mock-user-id',
        email: 'test@example.com',
        full_name: 'Test User',
        plan: 'free',
        search_count: 0,
        max_searches: 5,
        monthly_search_count: 0,
        created_at: new Date().toISOString(),
      },
    ]);
  }),

  http.get('*/rest/v1/legal_cases', () => {
    return HttpResponse.json([
      {
        id: 'mock-case-id',
        title: 'Test Legal Case',
        court: 'Test Court',
        case_number: 'TEST-001',
        decision_date: '2024-01-01',
        department: 'Test Department',
        summary: 'Test summary',
        keywords: ['test', 'case'],
        full_text: 'Test full text content',
        created_at: new Date().toISOString(),
      },
    ]);
  }),

  http.get('*/rest/v1/subscription_plans', () => {
    return HttpResponse.json([
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'TL',
        max_searches: 5,
        features: ['Basic search', 'Limited results'],
        is_popular: false,
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 99,
        currency: 'TL',
        max_searches: 100,
        features: ['Advanced search', 'Unlimited results', 'Export data'],
        is_popular: true,
      },
    ]);
  }),
];