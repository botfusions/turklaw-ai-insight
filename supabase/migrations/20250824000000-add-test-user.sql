-- Add test user for development and testing
-- Note: In production, users should be created through Supabase Auth UI

-- First, let's insert a test user into auth.users (if not exists)
-- This is typically done through Supabase Auth, but for testing we can simulate it

-- Check if test user profile exists, if not create one
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  plan,
  search_count,
  max_searches,
  monthly_search_count,
  last_search_reset,
  created_at,
  updated_at
)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, -- Fixed UUID for test user
  'cenk.tokgoz@gmail.com',
  'Cenk Tokgöz',
  'pro', -- Give pro plan for testing
  0,
  100, -- Pro plan search limit
  0,
  CURRENT_DATE,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  plan = EXCLUDED.plan,
  max_searches = EXCLUDED.max_searches,
  updated_at = NOW();

-- Add some test search history for the user
INSERT INTO public.user_searches (
  user_id,
  query,
  filters,
  results_count,
  search_date
) VALUES 
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'iş sözleşmesi feshi',
  '{"court": "Yargıtay", "category": "İş Hukuku"}',
  15,
  NOW() - INTERVAL '2 hours'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'trafik kazası tazminat',
  '{"court": "Asliye Hukuk", "category": "Tazminat"}',
  23,
  NOW() - INTERVAL '1 day'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'boşanma nafaka',
  '{"court": "Aile Mahkemesi", "category": "Aile Hukuku"}',
  8,
  NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO NOTHING;

-- Add some saved cases for the test user
INSERT INTO public.saved_cases (
  user_id,
  case_id,
  notes,
  saved_at
)
SELECT 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  lc.id,
  CASE 
    WHEN lc.title LIKE '%İş Sözleşmesi%' THEN 'Önemli emsal karar - müvekkil davası için referans'
    WHEN lc.title LIKE '%Trafik%' THEN 'Trafik kazası davaları için örnek'
    ELSE 'İncelenmek üzere kaydedildi'
  END,
  NOW() - (RANDOM() * INTERVAL '30 days')
FROM public.legal_cases lc
LIMIT 2
ON CONFLICT (user_id, case_id) DO NOTHING;

-- Grant necessary permissions if needed
-- Note: RLS policies should already handle access control