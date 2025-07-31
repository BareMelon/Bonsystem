const Database = require('better-sqlite3');
const path = require('path');

// Database file path - use Railway's persistent storage if available
const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'bonsystem.db');

console.log('Database path:', dbPath);

// Create database connection
let db;
try {
  db = new Database(dbPath);
  console.log('Forbundet til SQLite database');
  console.log('Database path:', dbPath);
  initDatabase();
} catch (error) {
  console.error('Database error:', error.message);
  console.error('Database path:', dbPath);
  db = null;
}

// Initialize database tables
function initDatabase() {
  console.log('Initializing database tables...');
  
  // Orders table
  try {
    db.exec(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mad TEXT NOT NULL,
      drikke TEXT,
      ekstra_info TEXT,
      telefon TEXT,
      status TEXT DEFAULT 'ny',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('Orders tabel er klar');
  } catch (err) {
    console.error('Fejl ved oprettelse af orders tabel:', err);
  }

  // Settings table for admin configuration
  try {
    db.exec(`CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('Settings tabel er klar');
    // Insert default settings
    insertDefaultSettings();
  } catch (err) {
    console.error('Fejl ved oprettelse af settings tabel:', err);
  }
}

// Insert default settings
function insertDefaultSettings() {
  console.log('Inserting default settings...');
  const defaultSettings = [
    { key: 'restaurant_name', value: 'Bon System' }
  ];

  defaultSettings.forEach(setting => {
    try {
      db.prepare(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`).run(setting.key, setting.value);
      console.log(`Setting ${setting.key} inserted`);
    } catch (err) {
      console.error(`Fejl ved indsættelse af setting ${setting.key}:`, err);
    }
  });
}

// Helper functions for database operations
const dbHelpers = {
  // Get all orders
  getAllOrders: () => {
    if (!db) return Promise.resolve([]);
    try {
      const stmt = db.prepare(`SELECT * FROM orders ORDER BY created_at DESC`);
      return Promise.resolve(stmt.all());
    } catch (err) {
      return Promise.reject(err);
    }
  },

  // Get order by ID
  getOrderById: (id) => {
    if (!db) return Promise.resolve(null);
    try {
      const stmt = db.prepare(`SELECT * FROM orders WHERE id = ?`);
      return Promise.resolve(stmt.get(id));
    } catch (err) {
      return Promise.reject(err);
    }
  },

  // Create new order
  createOrder: (orderData) => {
    if (!db) return Promise.reject(new Error('Database not available'));
    try {
      const { mad, drikke, ekstra_info, telefon } = orderData;
      const stmt = db.prepare(`INSERT INTO orders (mad, drikke, ekstra_info, telefon) VALUES (?, ?, ?, ?)`);
      const result = stmt.run(mad, drikke, ekstra_info, telefon);
      return Promise.resolve({ id: result.lastInsertRowid, ...orderData });
    } catch (err) {
      return Promise.reject(err);
    }
  },

  // Update order status
  updateOrderStatus: (id, status) => {
    if (!db) return Promise.reject(new Error('Database not available'));
    try {
      const stmt = db.prepare(`UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
      stmt.run(status, id);
      return Promise.resolve({ id, status });
    } catch (err) {
      return Promise.reject(err);
    }
  },

  // Get settings
  getSettings: () => {
    if (!db) return Promise.resolve({});
    try {
      const stmt = db.prepare(`SELECT key, value FROM settings`);
      const rows = stmt.all();
      const settings = {};
      rows.forEach(row => {
        settings[row.key] = row.value;
      });
      return Promise.resolve(settings);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  // Update setting
  updateSetting: (key, value) => {
    if (!db) return Promise.reject(new Error('Database not available'));
    try {
      const stmt = db.prepare(`UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?`);
      stmt.run(value, key);
      return Promise.resolve({ key, value });
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = { db, dbHelpers }; 