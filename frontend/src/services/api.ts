import axios from 'axios';

// API base URL - use Railway backend in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bonsystem-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Types
export interface Order {
  id: number;
  mad: string;
  drikke?: string;
  ekstra_info?: string;
  telefon?: string;
  status: 'ny' | 'behandles' | 'klar' | 'afsendt' | 'annulleret';
  created_at: string;
  updated_at: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order?: Order;
  orders?: Order[];
}

export interface Settings {
  restaurant_name?: string;
  admin_phone?: string;
  twilio_account_sid?: string;
  twilio_auth_token?: string;
  twilio_phone_number?: string;
}

export interface Stats {
  totalOrders: number;
  newOrders: number;
  processingOrders: number;
  readyOrders: number;
  sentOrders: number;
  cancelledOrders: number;
}

// Order API
export const orderAPI = {
  createOrder: async (order: { mad: string; drikke?: string; ekstra_info?: string; telefon?: string }) => {
    try {
      const response = await api.post<OrderResponse>('/orders', order);
      return response.data;
    } catch (error) {
      console.error('Fejl ved oprettelse af bestilling:', error);
      throw new Error('Kunne ikke oprette bestilling');
    }
  },
  getAllOrders: async () => {
    try {
      const response = await api.get<OrderResponse>('/orders');
      return response.data.orders || [];
    } catch (error) {
      console.error('Fejl ved hentning af bestillinger:', error);
      throw new Error('Kunne ikke hente bestillinger');
    }
  },
  getOrderById: async (id: number) => {
    try {
      const response = await api.get<OrderResponse>(`/orders/${id}`);
      return response.data.order;
    } catch (error) {
      console.error(`Fejl ved hentning af bestilling ${id}:`, error);
      throw new Error('Kunne ikke hente bestilling');
    }
  },
  updateOrderStatus: async (id: number, status: string) => {
    try {
      console.log(`API: Updating order ${id} to status ${status}`);
      console.log(`API URL: ${API_BASE_URL}/orders/${id}/status`);
      const response = await api.put<OrderResponse>(`/orders/${id}/status`, { status });
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Fejl ved opdatering af status for bestilling ${id}:`, error);
      console.error('API error details:', error.response?.data);
      throw new Error('Kunne ikke opdatere bestillingsstatus');
    }
  },
};

// Admin API
export const adminAPI = {
  getSettings: async () => {
    try {
      const response = await api.get<{ settings: Settings }>('/admin/settings');
      return response.data.settings;
    } catch (error) {
      console.error('Fejl ved hentning af indstillinger:', error);
      throw new Error('Kunne ikke hente indstillinger');
    }
  },
  updateSettings: async (settings: Settings) => {
    try {
      const response = await api.put<{ success: boolean; message: string }>('/admin/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Fejl ved opdatering af indstillinger:', error);
      throw new Error('Kunne ikke opdatere indstillinger');
    }
  },
  getStats: async () => {
    try {
      const response = await api.get<{ stats: Stats }>('/admin/stats');
      return response.data.stats;
    } catch (error) {
      console.error('Fejl ved hentning af statistik:', error);
      throw new Error('Kunne ikke hente statistik');
    }
  },
  deleteOrder: async (id: number) => {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`/admin/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Fejl ved sletning af bestilling ${id}:`, error);
      throw new Error('Kunne ikke slette bestilling');
    }
  },
}; 