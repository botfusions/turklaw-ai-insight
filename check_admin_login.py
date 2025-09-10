#!/usr/bin/env python3
"""
TurkLawAI Admin Login Debug Script
Checks admin user status in Supabase database
"""

import os
import sys
import hashlib
from supabase import create_client, Client
from datetime import datetime

def get_supabase_client():
    """Initialize Supabase client"""
    supabase_url = "https://supabase.turklawai.com"
    # Service key for admin operations (not anon key)
    service_key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1NjY1MTM4MCwiZXhwIjo0OTEyMzI0OTgwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.x7YvP8C5F5vWL7qI9aabD4nZzp8cF5zI2mN3kP7T8E0"
    
    try:
        return create_client(supabase_url, service_key)
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
        return None

def check_tables_exist(supabase: Client):
    """Check if required tables exist"""
    print("🔍 Checking database tables...")
    
    try:
        # Check user subscriptions table
        result = supabase.table('yargi_mcp_user_subscriptions').select('*').limit(1).execute()
        print("✅ yargi_mcp_user_subscriptions table exists")
        
        return True
    except Exception as e:
        print(f"❌ Table check failed: {e}")
        return False

def check_admin_user(supabase: Client):
    """Check admin user status"""
    print("\n👤 Checking admin user...")
    
    admin_email = "cenk.tokgoz@gmail.com"
    
    try:
        # Query admin user
        result = supabase.table('yargi_mcp_user_subscriptions')\
            .select('*')\
            .eq('email', admin_email)\
            .execute()
        
        if result.data:
            user_data = result.data[0]
            print(f"✅ Admin user found:")
            print(f"   📧 Email: {user_data.get('email')}")
            print(f"   🆔 User ID: {user_data.get('user_id')}")
            print(f"   📦 Plan: {user_data.get('plan')}")
            print(f"   ✅ Status: {user_data.get('status')}")
            print(f"   🔢 Requests Limit: {user_data.get('requests_limit')}")
            print(f"   📅 Created: {user_data.get('created_at')}")
            print(f"   🔐 Last Login: {user_data.get('last_login')}")
            
            return user_data
        else:
            print(f"❌ Admin user not found with email: {admin_email}")
            return None
            
    except Exception as e:
        print(f"❌ Admin user check failed: {e}")
        return None

def check_auth_system():
    """Check authentication system"""
    print("\n🔐 Authentication System Analysis:")
    print("   🎯 Auth Method: Clerk OAuth 2.0")
    print("   📧 Admin Email: cenk.tokgoz@gmail.com")
    print("   ⚙️  Frontend: React with Clerk")
    print("   💾 Database: Supabase PostgreSQL")
    print("   🔑 Login Flow: OAuth → JWT Token → Supabase")

def suggest_fixes():
    """Suggest potential fixes"""
    print("\n🔧 POTENTIAL SOLUTIONS:")
    print("1. 📧 CLERK EMAIL CHECK:")
    print("   - Clerk dashboard'da cenk.tokgoz@gmail.com kayıtlı mı?")
    print("   - Primary email address doğru mu?")
    print("   - Email verified mi?")
    
    print("\n2. 🆔 USER ID SYNC:")
    print("   - Clerk User ID ile Supabase user_id eşleşiyor mu?")
    print("   - Clerk'dan gerçek User ID alıp Supabase'i güncelle")
    
    print("\n3. 🔑 OAUTH FLOW:")
    print("   - Clerk OAuth flow çalışıyor mu?")
    print("   - JWT token generate ediliyor mu?")
    print("   - Token'da email field var mı?")
    
    print("\n4. 🏗️  MANUAL FIX:")
    print("   - Clerk dashboard'da yeni user oluştur")
    print("   - User ID'yi kopyala")
    print("   - Supabase'de user_id güncelle")

def create_debug_admin_user():
    """Create a debug admin user with correct Clerk ID"""
    print("\n🔨 Creating debug admin user...")
    
    # Get current timestamp
    now = datetime.now().isoformat()
    
    sql_script = f"""
-- DEBUG: Create/Update Admin User
-- Run this in Supabase SQL Editor

-- Update existing admin user (if exists)
UPDATE yargi_mcp_user_subscriptions 
SET 
    plan = 'enterprise',
    status = 'active',
    requests_limit = 999999,
    updated_at = '{now}'
WHERE email = 'cenk.tokgoz@gmail.com';

-- Insert if doesn't exist
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
    'debug_admin_user_001', 
    'cenk.tokgoz@gmail.com',
    'enterprise',
    'active',
    999999,
    0,
    '{now}',
    '{now}',
    '{now}'
) ON CONFLICT (user_id) DO NOTHING;

-- Verify
SELECT * FROM yargi_mcp_user_subscriptions 
WHERE email = 'cenk.tokgoz@gmail.com';
"""
    
    print("📝 SQL Script generated:")
    print("=" * 50)
    print(sql_script)
    print("=" * 50)
    
    # Save to file
    with open('debug_admin_fix.sql', 'w', encoding='utf-8') as f:
        f.write(sql_script)
    
    print("✅ Script saved to: debug_admin_fix.sql")
    print("🚀 Run this in Supabase SQL Editor")

def main():
    print("🏛️  TurkLawAI Admin Login Debug")
    print("=" * 40)
    
    # Check authentication system
    check_auth_system()
    
    # Try to connect to Supabase
    supabase = get_supabase_client()
    
    if supabase:
        print("\n✅ Supabase connection successful")
        
        # Check tables
        if check_tables_exist(supabase):
            # Check admin user
            admin_user = check_admin_user(supabase)
            
            if not admin_user:
                print("\n❌ PROBLEM IDENTIFIED: Admin user not found in database")
                create_debug_admin_user()
        else:
            print("\n❌ Database tables not found or accessible")
    else:
        print("\n❌ Cannot connect to Supabase")
    
    # Always provide suggestions
    suggest_fixes()
    
    print("\n" + "=" * 40)
    print("🎯 NEXT STEPS:")
    print("1. Check Clerk dashboard for user")
    print("2. Run debug SQL script in Supabase")
    print("3. Test login again")
    print("4. Check browser console for errors")

if __name__ == "__main__":
    main()