import axios from 'axios';

// API base URL - will use environment variable in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Types
export interface Order {
  id?: number;
  mad: string;
  drikke?: string;
  ekstra_info?: string;
  telefon?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  order?: Order;
  orders?: Order[];
  error?: string;
}

export interface Settings {
  restaurant_name?: string;
}

export interface Stats {
  total_orders: number;
  new_orders: number;
  processing_orders: number;
  ready_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  today_orders: number;
}

// Order API
export const orderAPI = {
  createOrder: async (orderData: Order): Promise<OrderResponse> => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Der opstod en fejl'
      };
    }
  },

  getAllOrders: async (): Promise<OrderResponse> => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Der opstod en fejl'
      };
    }
  },

  getOrderById: async (id: number): Promise<OrderResponse> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Der opstod en fejl'
      };
    }
  },

  updateOrderStatus: async (id: number, status: string): Promise<OrderResponse> => {
    try {
      const response = await api.put(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Der opstod en fejl'
      };
    }
  }
};

// Admin API
export const adminAPI = {
  getSettings: async (): Promise<{ success: boolean; settings?: Settings; error?: string }> => {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Der opstod en fejl'
      };
    }
  },

  updateSettings: async (settings: Partial<Settings>): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await api.put('/admin/settings', settings);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Der opstod en fejl'
      };
    }
  },

  getStats: async (): Promise<{ success: boolean; stats?: Stats; error?: string }> => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Der opstod en fejl'
      };
    }
  },

  deleteOrder: async (id: number): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await api.delete(`/admin/orders/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Der opstod en fejl'
      };
    }
  }
}; 