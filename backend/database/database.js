const Database = require('better-sqlite3');
const path = require('path');

console.log('Using SQLite database for persistence');

// Database file path
const dbPath = path.join(__dirname, 'bonsystem.db');
let db;

try {
  db = new Database(dbPath);
  console.log('SQLite database connected successfully');
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mad TEXT NOT NULL,
      drikke TEXT DEFAULT '',
      ekstra_info TEXT DEFAULT '',
      telefon TEXT DEFAULT '',
      status TEXT DEFAULT 'ny',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT DEFAULT ''
    );
    
    CREATE TABLE IF NOT EXISTS food_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price REAL NOT NULL,
      available BOOLEAN DEFAULT 1
    );
    
    CREATE TABLE IF NOT EXISTS drink_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price REAL NOT NULL,
      available BOOLEAN DEFAULT 1
    );
  `);
  
  // Insert default settings if they don't exist
  const defaultSettings = [
    { key: 'restaurant_name', value: 'me&ma' },
    { key: 'admin_phone', value: '+4553379153' },
    { key: 'twilio_account_sid', value: '' },
    { key: 'twilio_auth_token', value: '' },
    { key: 'twilio_phone_number', value: '' }
  ];
  
  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  defaultSettings.forEach(setting => {
    insertSetting.run(setting.key, setting.value);
  });
  
  // Insert default menu items if they don't exist
  const defaultFoodItems = [
    { name: 'Pizza Margherita', description: 'Tomat, mozzarella, basilikum', price: 89 },
    { name: 'Burger Classic', description: 'Oksekød, salat, tomat, agurk', price: 95 },
    { name: 'Pasta Carbonara', description: 'Bacon, æg, parmesan', price: 79 },
    { name: 'Caesar Salat', description: 'Kylling, parmesan, croutoner', price: 69 }
  ];
  
  const insertFoodItem = db.prepare('INSERT OR IGNORE INTO food_items (name, description, price) VALUES (?, ?, ?)');
  defaultFoodItems.forEach(item => {
    insertFoodItem.run(item.name, item.description, item.price);
  });
  
  const defaultDrinkItems = [
    { name: 'Coca Cola', description: '33cl dåse', price: 25 },
    { name: 'Øl Tuborg', description: '33cl flaske', price: 35 },
    { name: 'Vand', description: '50cl flaske', price: 20 },
    { name: 'Kaffe', description: 'Friskbrygget', price: 30 }
  ];
  
  const insertDrinkItem = db.prepare('INSERT OR IGNORE INTO drink_items (name, description, price) VALUES (?, ?, ?)');
  defaultDrinkItems.forEach(item => {
    insertDrinkItem.run(item.name, item.description, item.price);
  });
  
  console.log('Database tables and default data initialized');
  
} catch (error) {
  console.error('Failed to initialize SQLite database:', error);
  throw error;
}

// Helper functions for database operations
const dbHelpers = {
  // Get all orders
  getAllOrders: () => {
    try {
      const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
      return Promise.resolve(stmt.all());
    } catch (error) {
      console.error('Error getting all orders:', error);
      return Promise.reject(error);
    }
  },

  // Get order by ID
  getOrderById: (id) => {
    try {
      const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
      const order = stmt.get(id);
      return Promise.resolve(order || null);
    } catch (error) {
      console.error('Error getting order by ID:', error);
      return Promise.reject(error);
    }
  },

  // Create new order
  createOrder: (orderData) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO orders (mad, drikke, ekstra_info, telefon, status)
        VALUES (?, ?, ?, ?, 'ny')
      `);
      
      const result = stmt.run(
        orderData.mad,
        orderData.drikke || '',
        orderData.ekstra_info || '',
        orderData.telefon || ''
      );
      
      const newOrder = {
        id: result.lastInsertRowid,
        ...orderData,
        status: 'ny',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Order created:', newOrder);
      return Promise.resolve(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      return Promise.reject(error);
    }
  },

  // Update order status
  updateOrderStatus: (id, status) => {
    try {
      console.log('Database: Updating order status', { id, status });
      
      const stmt = db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
      const result = stmt.run(status, id);
      
      if (result.changes > 0) {
        console.log('Order status updated:', { id, status });
        return Promise.resolve({ id, status });
      } else {
        console.log('Order not found:', id);
        return Promise.reject(new Error('Order not found'));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      return Promise.reject(error);
    }
  },

  // Get settings
  getSettings: () => {
    try {
      const stmt = db.prepare('SELECT key, value FROM settings');
      const settingsRows = stmt.all();
      
      const settingsObj = {};
      settingsRows.forEach(row => {
        settingsObj[row.key] = row.value;
      });
      
      return Promise.resolve(settingsObj);
    } catch (error) {
      console.error('Error getting settings:', error);
      return Promise.reject(error);
    }
  },

  // Update setting
  updateSetting: (key, value) => {
    try {
      const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
      stmt.run(key, value);
      
      console.log('Setting updated:', { key, value });
      return Promise.resolve({ key, value });
    } catch (error) {
      console.error('Error updating setting:', error);
      return Promise.reject(error);
    }
  },

  // Menu items functions
  getAllFoodItems: () => {
    try {
      const stmt = db.prepare('SELECT * FROM food_items WHERE available = 1');
      return Promise.resolve(stmt.all());
    } catch (error) {
      console.error('Error getting food items:', error);
      return Promise.reject(error);
    }
  },

  getAllDrinkItems: () => {
    try {
      const stmt = db.prepare('SELECT * FROM drink_items WHERE available = 1');
      return Promise.resolve(stmt.all());
    } catch (error) {
      console.error('Error getting drink items:', error);
      return Promise.reject(error);
    }
  },

  getFoodItem: (id) => {
    try {
      const stmt = db.prepare('SELECT * FROM food_items WHERE id = ?');
      const item = stmt.get(id);
      return Promise.resolve(item || null);
    } catch (error) {
      console.error('Error getting food item:', error);
      return Promise.reject(error);
    }
  },

  getDrinkItem: (id) => {
    try {
      const stmt = db.prepare('SELECT * FROM drink_items WHERE id = ?');
      const item = stmt.get(id);
      return Promise.resolve(item || null);
    } catch (error) {
      console.error('Error getting drink item:', error);
      return Promise.reject(error);
    }
  },

  createFoodItem: (itemData) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO food_items (name, description, price, available)
        VALUES (?, ?, ?, 1)
      `);
      
      const result = stmt.run(itemData.name, itemData.description, itemData.price);
      
      const newItem = {
        id: result.lastInsertRowid,
        ...itemData,
        available: true
      };
      
      return Promise.resolve(newItem);
    } catch (error) {
      console.error('Error creating food item:', error);
      return Promise.reject(error);
    }
  },

  createDrinkItem: (itemData) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO drink_items (name, description, price, available)
        VALUES (?, ?, ?, 1)
      `);
      
      const result = stmt.run(itemData.name, itemData.description, itemData.price);
      
      const newItem = {
        id: result.lastInsertRowid,
        ...itemData,
        available: true
      };
      
      return Promise.resolve(newItem);
    } catch (error) {
      console.error('Error creating drink item:', error);
      return Promise.reject(error);
    }
  },

  updateFoodItem: (id, itemData) => {
    try {
      const stmt = db.prepare(`
        UPDATE food_items 
        SET name = ?, description = ?, price = ?
        WHERE id = ?
      `);
      
      const result = stmt.run(itemData.name, itemData.description, itemData.price, id);
      
      if (result.changes > 0) {
        return Promise.resolve({ id, ...itemData });
      } else {
        return Promise.reject(new Error('Food item not found'));
      }
    } catch (error) {
      console.error('Error updating food item:', error);
      return Promise.reject(error);
    }
  },

  updateDrinkItem: (id, itemData) => {
    try {
      const stmt = db.prepare(`
        UPDATE drink_items 
        SET name = ?, description = ?, price = ?
        WHERE id = ?
      `);
      
      const result = stmt.run(itemData.name, itemData.description, itemData.price, id);
      
      if (result.changes > 0) {
        return Promise.resolve({ id, ...itemData });
      } else {
        return Promise.reject(new Error('Drink item not found'));
      }
    } catch (error) {
      console.error('Error updating drink item:', error);
      return Promise.reject(error);
    }
  },

  deleteFoodItem: (id) => {
    try {
      const stmt = db.prepare('UPDATE food_items SET available = 0 WHERE id = ?');
      const result = stmt.run(id);
      
      if (result.changes > 0) {
        return Promise.resolve({ success: true });
      } else {
        return Promise.reject(new Error('Food item not found'));
      }
    } catch (error) {
      console.error('Error deleting food item:', error);
      return Promise.reject(error);
    }
  },

  deleteDrinkItem: (id) => {
    try {
      const stmt = db.prepare('UPDATE drink_items SET available = 0 WHERE id = ?');
      const result = stmt.run(id);
      
      if (result.changes > 0) {
        return Promise.resolve({ success: true });
      } else {
        return Promise.reject(new Error('Drink item not found'));
      }
    } catch (error) {
      console.error('Error deleting drink item:', error);
      return Promise.reject(error);
    }
  }
};

// Mock database object for compatibility
const dbObject = {
  // Add any methods that might be called
};

module.exports = { db: dbObject, dbHelpers }; 