const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'bonsystem.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database error:', err.message);
  } else {
    console.log('Forbundet til SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mad TEXT NOT NULL,
    drikke TEXT,
    ekstra_info TEXT,
    telefon TEXT,
    status TEXT DEFAULT 'ny',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Fejl ved oprettelse af orders tabel:', err);
    } else {
      console.log('Orders tabel er klar');
    }
  });

  // Settings table for admin configuration
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Fejl ved oprettelse af settings tabel:', err);
    } else {
      console.log('Settings tabel er klar');
      // Insert default settings
      insertDefaultSettings();
    }
  });
}

// Insert default settings
function insertDefaultSettings() {
  const defaultSettings = [
    { key: 'restaurant_name', value: 'Bon System' }
  ];

  defaultSettings.forEach(setting => {
    db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`,
      [setting.key, setting.value], (err) => {
        if (err) {
          console.error(`Fejl ved indsættelse af setting ${setting.key}:`, err);
        }
      });
  });
}

// Helper functions for database operations
const dbHelpers = {
  // Get all orders
  getAllOrders: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM orders ORDER BY created_at DESC`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Get order by ID
  getOrderById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM orders WHERE id = ?`, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Create new order
  createOrder: (orderData) => {
    return new Promise((resolve, reject) => {
      const { mad, drikke, ekstra_info, telefon } = orderData;
      db.run(`INSERT INTO orders (mad, drikke, ekstra_info, telefon) VALUES (?, ?, ?, ?)`,
        [mad, drikke, ekstra_info, telefon], function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...orderData });
        });
    });
  },

  // Update order status
  updateOrderStatus: (id, status) => {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [status, id], function(err) {
          if (err) reject(err);
          else resolve({ id, status });
        });
    });
  },

  // Get settings
  getSettings: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT key, value FROM settings`, (err, rows) => {
        if (err) reject(err);
        else {
          const settings = {};
          rows.forEach(row => {
            settings[row.key] = row.value;
          });
          resolve(settings);
        }
      });
    });
  },

  // Update setting
  updateSetting: (key, value) => {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?`,
        [value, key], function(err) {
          if (err) reject(err);
          else resolve({ key, value });
        });
    });
  }
};

module.exports = { db, dbHelpers }; 