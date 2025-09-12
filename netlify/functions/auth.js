/**
 * TurkLawAI Standalone Authentication API
 * Netlify Functions implementation with JWT + SQLite
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'turklawai-super-secret-jwt-key-2025-production-ready-authentication-system-v2';
const JWT_EXPIRES_IN = '24h';

// Database path - Use /tmp for Netlify Functions
const DB_PATH = process.env.NETLIFY ? '/tmp/turklawai.db' : path.join(process.cwd(), 'turklawai_production.db');

// Database instance
let db = null;

const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    
    console.log('🔧 Initializing database:', DB_PATH);
    
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Database connection error:', err);
        return reject(err);
      }
      
      console.log('✅ Database connected:', DB_PATH);
      
      // Create users table if not exists
      db.serialize(() => {
        db.run(`
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
        `, (tableErr) => {
          if (tableErr) {
            console.error('❌ Table creation error:', tableErr);
            return reject(tableErr);
          }
          
          console.log('✅ Users table ready');
          
          // Check if admin user exists
          db.get('SELECT id FROM users WHERE email = ?', 'admin@turklawai.com', (checkErr, row) => {
            if (checkErr) {
              console.error('❌ Admin check error:', checkErr);
              // Continue anyway for now
            }
            
            if (!row) {
              // Create admin user
              bcrypt.hash('TurkLawAI2025!', 10, (hashErr, hash) => {
                if (hashErr) {
                  console.error('❌ Hash error:', hashErr);
                  return resolve(db); // Continue even if admin creation fails
                }
                
                db.run(
                  'INSERT INTO users (email, password_hash, full_name, plan) VALUES (?, ?, ?, ?)',
                  'admin@turklawai.com', hash, 'TurkLawAI Admin', 'premium',
                  (insertErr) => {
                    if (insertErr) {
                      console.error('❌ Admin creation error:', insertErr);
                    } else {
                      console.log('✅ Admin user created');
                    }
                    resolve(db);
                  }
                );
              });
            } else {
              console.log('✅ Admin user exists');
              resolve(db);
            }
          });
        });
      });
    });
  });
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
    let parsedBody = {};
    
    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch (jsonError) {
        console.error('❌ JSON Parse Error:', jsonError.message, 'Body:', body);
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: false, 
            message: 'Invalid JSON in request body',
            error: jsonError.message
          })
        };
      }
    }
    
    // Extract endpoint from path - handle both direct and redirect patterns
    let endpoint = requestPath.replace('/.netlify/functions/auth/', '');
    
    // Handle /api/auth/* redirects
    if (requestPath.startsWith('/api/auth/')) {
      endpoint = requestPath.replace('/api/auth/', '');
    }
    
    // Handle /api/health redirect
    if (requestPath === '/api/health') {
      endpoint = 'health';
    }
    
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
const handleLogin = ({ email, password }) => {
  return new Promise((resolve) => {
    try {
      if (!email || !password) {
        return resolve({
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, message: 'Email and password required' })
        });
      }

      db.get('SELECT * FROM users WHERE email = ? AND status = ?', email, 'active', async (err, user) => {
        if (err) {
          console.error('❌ Login database error:', err);
          return resolve({
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ success: false, message: 'Database error' })
          });
        }
        
        if (!user) {
          return resolve({
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({ success: false, message: 'Invalid credentials' })
          });
        }

        try {
          const validPassword = await bcrypt.compare(password, user.password_hash);
          if (!validPassword) {
            return resolve({
              statusCode: 401,
              headers: corsHeaders,
              body: JSON.stringify({ success: false, message: 'Invalid credentials' })
            });
          }

          const token = createToken(user);
          
          return resolve({
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
          });
        } catch (bcryptError) {
          console.error('❌ Password verification error:', bcryptError);
          return resolve({
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ success: false, message: 'Authentication error' })
          });
        }
      });
    } catch (error) {
      console.error('❌ Login handler error:', error);
      return resolve({
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: 'Internal error' })
      });
    }
  });
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

const handleHealth = () => {
  return new Promise((resolve) => {
    if (!db) {
      return resolve({
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          status: 'unhealthy',
          service: 'turklawai-auth',
          database: 'disconnected',
          timestamp: new Date().toISOString()
        })
      });
    }
    
    db.get('SELECT COUNT(*) as count FROM users', (err, userCount) => {
      resolve({
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          status: 'healthy',
          service: 'turklawai-auth',
          database: 'connected',
          users: err ? 'unknown' : userCount.count,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        })
      });
    });
  });
};