// Simple in-memory database for Railway deployment
console.log('Using in-memory database for Railway');

// In-memory storage
let orders = [];
let settings = [
  { key: 'restaurant_name', value: 'me&ma' }
];

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
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      order.updated_at = new Date().toISOString();
      console.log('Order status updated:', { id, status });
    }
    return Promise.resolve({ id, status });
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
  }
};

// Mock database object for compatibility
const db = {
  // Add any methods that might be called
};

module.exports = { db, dbHelpers }; 