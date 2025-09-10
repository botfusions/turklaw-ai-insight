#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TurkLawAI Admin Login Debug Script - Simple Version
Checks admin user status and provides fixes
"""

import os
import sys

def check_authentication_system():
    """Analyze authentication system"""
    print("TurkLawAI Admin Login Debug")
    print("=" * 40)
    
    print("\nAuthentication System Analysis:")
    print("- Auth Method: Clerk OAuth 2.0")
    print("- Admin Email: cenk.tokgoz@gmail.com")
    print("- Frontend: React with Clerk")
    print("- Database: Supabase PostgreSQL")
    print("- Login Flow: OAuth -> JWT Token -> Supabase")

def create_admin_fix_sql():
    """Create SQL fix for admin user"""
    sql_content = """-- TurkLawAI Admin User Fix
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
    'user_2qXXXXXXXXXXXXXXXXXXXXXXXX', -- REPLACE with real Clerk User ID
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
"""
    
    with open('admin_fix.sql', 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print("SQL Fix generated: admin_fix.sql")

def diagnose_login_issues():
    """Diagnose potential login issues"""
    print("\nPOTENTIAL LOGIN ISSUES:")
    print("=" * 25)
    
    print("\n1. CLERK USER ID MISMATCH:")
    print("- Problem: Supabase user_id != Clerk User ID")
    print("- Solution: Get real Clerk User ID and update database")
    
    print("\n2. EMAIL NOT VERIFIED:")
    print("- Problem: Clerk email not verified")
    print("- Solution: Verify email in Clerk dashboard")
    
    print("\n3. OAUTH FLOW BROKEN:")
    print("- Problem: JWT token not generated properly")
    print("- Solution: Check Clerk keys and configuration")
    
    print("\n4. DATABASE PERMISSIONS:")
    print("- Problem: User not in database or inactive")
    print("- Solution: Run admin_fix.sql in Supabase")

def provide_step_by_step_fix():
    """Provide step by step fix instructions"""
    print("\nSTEP-BY-STEP FIX:")
    print("=" * 18)
    
    print("\nSTEP 1: GET CLERK USER ID")
    print("- Go to: https://dashboard.clerk.com/")
    print("- Find user: cenk.tokgoz@gmail.com")
    print("- Copy User ID (starts with user_2q...)")
    
    print("\nSTEP 2: UPDATE SUPABASE")
    print("- Open admin_fix.sql (generated)")
    print("- Replace 'user_2qXXXXXXXXXXXXXXXXXXXXXXXX' with real User ID")
    print("- Run in Supabase SQL Editor")
    
    print("\nSTEP 3: TEST LOGIN")
    print("- Clear browser cache")
    print("- Go to TurkLawAI.com")
    print("- Try login with cenk.tokgoz@gmail.com")
    print("- Check browser console for errors")
    
    print("\nSTEP 4: VERIFY DATABASE")
    print("- Check if user exists in database")
    print("- Verify plan = 'enterprise'")
    print("- Verify status = 'active'")

def check_common_issues():
    """Check for common authentication issues"""
    print("\nCOMMON ISSUES CHECKLIST:")
    print("=" * 24)
    
    issues = [
        "Clerk keys expired or incorrect",
        "Supabase connection string wrong",
        "User ID mismatch between Clerk and Supabase",
        "Email not verified in Clerk",
        "JWT token missing email field",
        "Database table doesn't exist",
        "User status is 'inactive' in database",
        "CORS issues blocking authentication",
        "Browser cache storing old tokens"
    ]
    
    for i, issue in enumerate(issues, 1):
        print(f"{i:2d}. {issue}")

def main():
    """Main debug function"""
    check_authentication_system()
    diagnose_login_issues()
    create_admin_fix_sql()
    provide_step_by_step_fix()
    check_common_issues()
    
    print("\n" + "=" * 40)
    print("IMMEDIATE ACTIONS:")
    print("1. Check Clerk dashboard for user ID")
    print("2. Run admin_fix.sql in Supabase")
    print("3. Test login and check console")
    print("4. Report back with any errors")

if __name__ == "__main__":
    main()