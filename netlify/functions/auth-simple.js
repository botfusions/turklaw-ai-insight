/**
 * Ultra Simple TurkLawAI Auth Function
 * No database, just hardcoded admin user for testing
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'turklawai-super-secret-jwt-key-2025-production-ready-authentication-system-v2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Hardcoded admin user (password: TurkLawAI2025!)
const ADMIN_HASH = '$2a$10$zKrWBQ3G8UvV8.Md8WvbIeYFGxXGGXG8UvV8.Md8WvbIeYFGxXGGXG'; // Will generate this

const createToken = (user) => {
  return jwt.sign(
    {
      user_id: user.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

exports.handler = async (event, context) => {
  console.log('🔧 Simple Auth Handler:', event.httpMethod, event.path);
  
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    const { httpMethod, path: requestPath, body } = event;
    
    // Parse body safely
    let parsedBody = {};
    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, message: 'Invalid JSON' })
        };
      }
    }

    // Extract endpoint
    let endpoint = requestPath.replace('/.netlify/functions/auth-simple/', '');
    if (requestPath.startsWith('/api/auth/')) {
      endpoint = requestPath.replace('/api/auth/', '');
    }
    if (requestPath === '/api/health') {
      endpoint = 'health';
    }

    console.log(`🔧 Endpoint: ${httpMethod}:${endpoint}`);

    // Handle endpoints
    if (httpMethod === 'GET' && endpoint === 'health') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          status: 'healthy',
          service: 'turklawai-simple-auth',
          database: 'hardcoded',
          timestamp: new Date().toISOString()
        })
      };
    }

    if (httpMethod === 'POST' && endpoint === 'login') {
      const { email, password } = parsedBody;
      
      if (!email || !password) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, message: 'Email and password required' })
        };
      }

      // Check hardcoded admin - multiple password options for testing
      if (email === 'admin@turklawai.com' && (password === 'TurkLawAI2025!' || password === 'admin123' || password === 'TurkLawAI2025')) {
        const user = {
          id: 1,
          email: 'admin@turklawai.com',
          full_name: 'TurkLawAI Admin',
          plan: 'premium'
        };

        const token = createToken(user);

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            message: 'Login successful',
            user: user,
            token: token
          })
        };
      }

      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: 'Invalid credentials' })
      };
    }

    // Default response
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: 'Endpoint not found' })
    };

  } catch (error) {
    console.error('❌ Handler error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        message: 'Internal server error',
        error: error.message
      })
    };
  }
};