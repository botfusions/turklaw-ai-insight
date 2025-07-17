-- Remove credit system columns from profiles table
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS search_count,
DROP COLUMN IF EXISTS max_searches,
DROP COLUMN IF EXISTS monthly_search_count,
DROP COLUMN IF EXISTS last_search_reset;