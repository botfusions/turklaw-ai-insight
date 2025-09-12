/**
 * TurkLawAI Standalone Authentication API
 * Netlify Functions implementation with JWT + SQLite
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'turklawai-super-secret-jwt-key-2025-production-ready-authentication-system-v2';
const JWT_EXPIRES_IN = '24h';

// Database path
const DB_PATH = path.join(process.cwd(), 'turklawai_production.db');

// Initialize database
let db = null;

const initDB = async () => {
  if (db) return db;
  
  db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
  
  // Create users table if not exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT DEFAULT '',
      plan TEXT DEFAULT 'free',
      status TEXT DEFAULT 'active',
      requests_used INTEGER DEFAULT 0,
      requests_limit INTEGER DEFAULT 100,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create admin user if not exists
  const adminExists = await db.get('SELECT id FROM users WHERE email = ?', 'admin@turklawai.com');
  if (!adminExists) {
    const adminPasswordHash = await bcrypt.hash('TurkLawAI2025!', 10);
    await db.run(
      'INSERT INTO users (email, password_hash, full_name, plan) VALUES (?, ?, ?, ?)',
      'admin@turklawai.com', adminPasswordHash, 'TurkLawAI Admin', 'premium'
    );
    console.log('✅ Admin user created');
  }
  
  return db;
};

// Helper functions
const createToken = (user) => {
  return jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      full_name: user.full_name,
      plan: user.plan
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Main handler
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    await initDB();
    
    const { httpMethod, path: requestPath, body, headers } = event;
    const parsedBody = body ? JSON.parse(body) : {};
    
    // Extract endpoint from path
    const endpoint = requestPath.replace('/.netlify/functions/auth/', '');
    
    console.log(`🔧 Auth API: ${httpMethod} ${endpoint}`, { body: parsedBody });

    switch (`${httpMethod}:${endpoint}`) {
      case 'POST:login':
        return await handleLogin(parsedBody);
        
      case 'POST:register':
        return await handleRegister(parsedBody);
        
      case 'POST:verify':
        return await handleVerify(headers);
        
      case 'GET:health':
        return await handleHealth();
        
      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, message: 'Endpoint not found' })
        };
    }
  } catch (error) {
    console.error('🚨 Auth API Error:', error);
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

// Auth handlers
const handleLogin = async ({ email, password }) => {
  try {
    if (!email || !password) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: 'Email and password required' })
      };
    }

    const user = await db.get('SELECT * FROM users WHERE email = ? AND status = ?', email, 'active');
    
    if (!user) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: 'Invalid credentials' })
      };
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: 'Invalid credentials' })
      };
    }

    const token = createToken(user);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          plan: user.plan
        },
        token
      })
    };
  } catch (error) {
    throw error;
  }
};

const handleRegister = async ({ email, password, full_name = '' }) => {
  try {
    if (!email || !password) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: 'Email and password required' })
      };
    }

    if (password.length < 6) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: 'Password must be at least 6 characters' })
      };
    }

    // Check if user exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', email);
    if (existingUser) {
      return {
        statusCode: 409,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: 'User already exists' })
      };
    }

    // Create user
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
      email, passwordHash, full_name
    );

    const newUser = await db.get('SELECT * FROM users WHERE id = ?', result.lastID);
    const token = createToken(newUser);

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Registration successful',
        user: {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          plan: newUser.plan
        },
        token
      })
    };
  } catch (error) {
    throw error;
  }
};

const handleVerify = async (headers) => {
  try {
    const authHeader = headers.authorization || headers.Authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: 'No token provided' })
      };
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);
    
    const user = await db.get('SELECT * FROM users WHERE id = ? AND status = ?', decoded.user_id, 'active');
    if (!user) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: 'User not found' })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          plan: user.plan
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: 'Invalid token' })
    };
  }
};

const handleHealth = async () => {
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      status: 'healthy',
      service: 'turklawai-auth',
      database: 'connected',
      users: userCount.count,
      timestamp: new Date().toISOString()
    })
  };
};