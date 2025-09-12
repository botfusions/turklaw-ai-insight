/**
 * Initialize SQLite Database for TurkLawAI
 * Creates the database with proper schema and admin user
 */

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'turklawai_production.db');

async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('🚨 Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('✅ Connected to SQLite database');
    });

    // Create users table
    db.serialize(async () => {
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
      `, (err) => {
        if (err) {
          console.error('🚨 Error creating users table:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Users table created/verified');
      });

      // Check if admin user exists
      db.get('SELECT id FROM users WHERE email = ?', 'admin@turklawai.com', async (err, row) => {
        if (err) {
          console.error('🚨 Error checking admin user:', err.message);
          reject(err);
          return;
        }

        if (!row) {
          // Create admin user
          try {
            const adminPasswordHash = await bcrypt.hash('TurkLawAI2025!', 10);
            
            db.run(
              'INSERT INTO users (email, password_hash, full_name, plan) VALUES (?, ?, ?, ?)',
              ['admin@turklawai.com', adminPasswordHash, 'TurkLawAI Admin', 'premium'],
              function(err) {
                if (err) {
                  console.error('🚨 Error creating admin user:', err.message);
                  reject(err);
                  return;
                }
                console.log('✅ Admin user created with ID:', this.lastID);
                console.log('📧 Admin email: admin@turklawai.com');
                console.log('🔑 Admin password: TurkLawAI2025!');
                
                db.close((err) => {
                  if (err) {
                    console.error('🚨 Error closing database:', err.message);
                    reject(err);
                  } else {
                    console.log('✅ Database connection closed');
                    resolve(true);
                  }
                });
              }
            );
          } catch (hashError) {
            console.error('🚨 Error hashing admin password:', hashError.message);
            reject(hashError);
          }
        } else {
          console.log('✅ Admin user already exists');
          console.log('📧 Admin email: admin@turklawai.com');
          console.log('🔑 Admin password: TurkLawAI2025!');
          
          db.close((err) => {
            if (err) {
              console.error('🚨 Error closing database:', err.message);
              reject(err);
            } else {
              console.log('✅ Database connection closed');
              resolve(true);
            }
          });
        }
      });
    });
  });
}

// Run initialization
if (require.main === module) {
  console.log('🔧 Initializing TurkLawAI database...');
  initializeDatabase()
    .then(() => {
      console.log('✅ Database initialization completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('🚨 Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };