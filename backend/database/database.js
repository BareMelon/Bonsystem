// Simple in-memory database for reliability
console.log('Using in-memory database for reliability');

// In-memory storage
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

console.log('In-memory database initialized successfully');

// Helper functions for database operations
const dbHelpers = {
  // Get all orders
  getAllOrders: () => {
    return Promise.resolve(orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  },

  // Get order by ID
  getOrderById: (id) => {
    return Promise.resolve(orders.find(order => order.id === id) || null);
  },

  // Create new order
  createOrder: (orderData) => {
    const newOrder = {
      id: orders.length + 1,
      ...orderData,
      status: 'ny',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    orders.push(newOrder);
    console.log('Order created:', newOrder);
    return Promise.resolve(newOrder);
  },

  // Update order status
  updateOrderStatus: (id, status) => {
    console.log('Database: Updating order status', { id, status });
    const order = orders.find(o => o.id === parseInt(id));
    console.log('Found order:', order);
    
    if (order) {
      order.status = status;
      order.updated_at = new Date().toISOString();
      console.log('Order status updated:', { id, status });
      return Promise.resolve({ id, status });
    } else {
      console.log('Order not found:', id);
      return Promise.reject(new Error('Order not found'));
    }
  },

  // Get settings
  getSettings: () => {
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    return Promise.resolve(settingsObj);
  },

  // Update setting
  updateSetting: (key, value) => {
    const setting = settings.find(s => s.key === key);
    if (setting) {
      setting.value = value;
    } else {
      settings.push({ key, value });
    }
    console.log('Setting updated:', { key, value });
    return Promise.resolve({ key, value });
  },

  // Menu items functions
  getAllFoodItems: () => {
    return Promise.resolve(foodItems.filter(item => item.available));
  },

  getAllDrinkItems: () => {
    return Promise.resolve(drinkItems.filter(item => item.available));
  },

  getFoodItem: (id) => {
    return Promise.resolve(foodItems.find(item => item.id === parseInt(id)));
  },

  getDrinkItem: (id) => {
    return Promise.resolve(drinkItems.find(item => item.id === parseInt(id)));
  },

  createFoodItem: (itemData) => {
    const newItem = {
      id: Math.max(...foodItems.map(f => f.id), 0) + 1,
      ...itemData,
      available: true
    };
    foodItems.push(newItem);
    return Promise.resolve(newItem);
  },

  createDrinkItem: (itemData) => {
    const newItem = {
      id: Math.max(...drinkItems.map(d => d.id), 0) + 1,
      ...itemData,
      available: true
    };
    drinkItems.push(newItem);
    return Promise.resolve(newItem);
  },

  updateFoodItem: (id, itemData) => {
    const item = foodItems.find(f => f.id === parseInt(id));
    if (item) {
      Object.assign(item, itemData);
      return Promise.resolve(item);
    }
    return Promise.reject(new Error('Food item not found'));
  },

  updateDrinkItem: (id, itemData) => {
    const item = drinkItems.find(d => d.id === parseInt(id));
    if (item) {
      Object.assign(item, itemData);
      return Promise.resolve(item);
    }
    return Promise.reject(new Error('Drink item not found'));
  },

  deleteFoodItem: (id) => {
    const item = foodItems.find(f => f.id === parseInt(id));
    if (item) {
      item.available = false;
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error('Food item not found'));
  },

  deleteDrinkItem: (id) => {
    const item = drinkItems.find(d => d.id === parseInt(id));
    if (item) {
      item.available = false;
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error('Drink item not found'));
  }
};

// Mock database object for compatibility
const db = {
  // Add any methods that might be called
};

module.exports = { db, dbHelpers }; 