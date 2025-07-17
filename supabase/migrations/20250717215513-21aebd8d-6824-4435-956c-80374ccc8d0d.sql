-- First add the pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add timestamp index for faster history sorting
CREATE INDEX IF NOT EXISTS search_date_idx ON public.user_searches (search_date DESC);

-- Add user_id index for faster filtering by user
CREATE INDEX IF NOT EXISTS user_searches_user_id_idx ON public.user_searches (user_id);

-- Now add a text search index after extension is created
CREATE INDEX IF NOT EXISTS search_query_text_idx ON public.user_searches USING gin(query gin_trgm_ops);