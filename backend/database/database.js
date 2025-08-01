// Fallback to in-memory database if SQLite fails
console.log('Attempting to use SQLite database for persistence');

let db = null;
let useInMemory = false;

try {
  const Database = require('better-sqlite3');
  const path = require('path');

  // Database file path
  const dbPath = path.join(__dirname, 'bonsystem.db');
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
  console.error('Failed to initialize SQLite database, falling back to in-memory:', error);
  useInMemory = true;
  
  // In-memory storage as fallback
  let orders = [];
  let settings = [
    { key: 'restaurant_name', value: 'me&ma' },
    { key: 'admin_phone', value: '+4553379153' },
    { key: 'twilio_account_sid', value: '' },
    { key: 'twilio_auth_token', value: '' },
    { key: 'twilio_phone_number', value: '' }
  ];

  // Menu items
  let foodItems = [
    { id: 1, name: 'Pizza Margherita', description: 'Tomat, mozzarella, basilikum', price: 89, available: true },
    { id: 2, name: 'Burger Classic', description: 'Oksekød, salat, tomat, agurk', price: 95, available: true },
    { id: 3, name: 'Pasta Carbonara', description: 'Bacon, æg, parmesan', price: 79, available: true },
    { id: 4, name: 'Caesar Salat', description: 'Kylling, parmesan, croutoner', price: 69, available: true }
  ];

  let drinkItems = [
    { id: 1, name: 'Coca Cola', description: '33cl dåse', price: 25, available: true },
    { id: 2, name: 'Øl Tuborg', description: '33cl flaske', price: 35, available: true },
    { id: 3, name: 'Vand', description: '50cl flaske', price: 20, available: true },
    { id: 4, name: 'Kaffe', description: 'Friskbrygget', price: 30, available: true }
  ];
}

// Helper functions for database operations
const dbHelpers = {
  // Get all orders
  getAllOrders: () => {
    if (useInMemory) {
      return Promise.resolve(orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    }
    
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
    if (useInMemory) {
      return Promise.resolve(orders.find(order => order.id === id) || null);
    }
    
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
    if (useInMemory) {
      const newOrder = {
        id: orders.length + 1,
        ...orderData,
        status: 'ny',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      orders.push(newOrder);
      console.log('Order created (in-memory):', newOrder);
      return Promise.resolve(newOrder);
    }
    
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
      
      console.log('Order created (SQLite):', newOrder);
      return Promise.resolve(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      return Promise.reject(error);
    }
  },

  // Update order status
  updateOrderStatus: (id, status) => {
    if (useInMemory) {
      console.log('Database: Updating order status (in-memory)', { id, status });
      const order = orders.find(o => o.id === parseInt(id));
      console.log('Found order:', order);
      
      if (order) {
        order.status = status;
        order.updated_at = new Date().toISOString();
        console.log('Order status updated (in-memory):', { id, status });
        return Promise.resolve({ id, status });
      } else {
        console.log('Order not found (in-memory):', id);
        return Promise.reject(new Error('Order not found'));
      }
    }
    
    try {
      console.log('Database: Updating order status (SQLite)', { id, status });
      
      const stmt = db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
      const result = stmt.run(status, id);
      
      if (result.changes > 0) {
        console.log('Order status updated (SQLite):', { id, status });
        return Promise.resolve({ id, status });
      } else {
        console.log('Order not found (SQLite):', id);
        return Promise.reject(new Error('Order not found'));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      return Promise.reject(error);
    }
  },

  // Get settings
  getSettings: () => {
    if (useInMemory) {
      const settingsObj = {};
      settings.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });
      return Promise.resolve(settingsObj);
    }
    
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
    if (useInMemory) {
      const setting = settings.find(s => s.key === key);
      if (setting) {
        setting.value = value;
      } else {
        settings.push({ key, value });
      }
      console.log('Setting updated (in-memory):', { key, value });
      return Promise.resolve({ key, value });
    }
    
    try {
      const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
      stmt.run(key, value);
      
      console.log('Setting updated (SQLite):', { key, value });
      return Promise.resolve({ key, value });
    } catch (error) {
      console.error('Error updating setting:', error);
      return Promise.reject(error);
    }
  },

  // Menu items functions
  getAllFoodItems: () => {
    if (useInMemory) {
      return Promise.resolve(foodItems.filter(item => item.available));
    }
    
    try {
      const stmt = db.prepare('SELECT * FROM food_items WHERE available = 1');
      return Promise.resolve(stmt.all());
    } catch (error) {
      console.error('Error getting food items:', error);
      return Promise.reject(error);
    }
  },

  getAllDrinkItems: () => {
    if (useInMemory) {
      return Promise.resolve(drinkItems.filter(item => item.available));
    }
    
    try {
      const stmt = db.prepare('SELECT * FROM drink_items WHERE available = 1');
      return Promise.resolve(stmt.all());
    } catch (error) {
      console.error('Error getting drink items:', error);
      return Promise.reject(error);
    }
  },

  getFoodItem: (id) => {
    if (useInMemory) {
      return Promise.resolve(foodItems.find(item => item.id === parseInt(id)));
    }
    
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
    if (useInMemory) {
      return Promise.resolve(drinkItems.find(item => item.id === parseInt(id)));
    }
    
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
    if (useInMemory) {
      const newItem = {
        id: Math.max(...foodItems.map(f => f.id), 0) + 1,
        ...itemData,
        available: true
      };
      foodItems.push(newItem);
      return Promise.resolve(newItem);
    }
    
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
    if (useInMemory) {
      const newItem = {
        id: Math.max(...drinkItems.map(d => d.id), 0) + 1,
        ...itemData,
        available: true
      };
      drinkItems.push(newItem);
      return Promise.resolve(newItem);
    }
    
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
    if (useInMemory) {
      const item = foodItems.find(f => f.id === parseInt(id));
      if (item) {
        Object.assign(item, itemData);
        return Promise.resolve(item);
      }
      return Promise.reject(new Error('Food item not found'));
    }
    
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
    if (useInMemory) {
      const item = drinkItems.find(d => d.id === parseInt(id));
      if (item) {
        Object.assign(item, itemData);
        return Promise.resolve(item);
      }
      return Promise.reject(new Error('Drink item not found'));
    }
    
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
    if (useInMemory) {
      const item = foodItems.find(f => f.id === parseInt(id));
      if (item) {
        item.available = false;
        return Promise.resolve({ success: true });
      }
      return Promise.reject(new Error('Food item not found'));
    }
    
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
    if (useInMemory) {
      const item = drinkItems.find(d => d.id === parseInt(id));
      if (item) {
        item.available = false;
        return Promise.resolve({ success: true });
      }
      return Promise.reject(new Error('Drink item not found'));
    }
    
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