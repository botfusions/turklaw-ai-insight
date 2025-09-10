-- TurkLawAI Admin User Fix
-- Run this in Supabase SQL Editor

-- Check if admin user exists
SELECT * FROM yargi_mcp_user_subscriptions 
WHERE email = 'cenk.tokgoz@gmail.com';

-- Update existing admin user
UPDATE yargi_mcp_user_subscriptions 
SET 
    plan = 'enterprise',
    status = 'active',
    requests_limit = 999999,
    updated_at = NOW()
WHERE email = 'cenk.tokgoz@gmail.com';

-- Insert if doesn't exist (use real Clerk User ID)
INSERT INTO yargi_mcp_user_subscriptions (
    user_id, 
    email, 
    plan, 
    status, 
    requests_limit,
    requests_used,
    created_at,
    updated_at,
    last_login
) VALUES (
    'user_32KOCwWfWIwvQTgfdI3T7QDsJya', -- Real Clerk User ID from cenkv1 vault
    'cenk.tokgoz@gmail.com',
    'enterprise',
    'active',
    999999,
    0,
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    plan = EXCLUDED.plan,
    status = EXCLUDED.status,
    requests_limit = EXCLUDED.requests_limit,
    updated_at = NOW();

-- Verify the fix
SELECT 
    user_id,
    email,
    plan,
    status,
    requests_limit,
    created_at,
    last_login
FROM yargi_mcp_user_subscriptions 
WHERE email = 'cenk.tokgoz@gmail.com';
