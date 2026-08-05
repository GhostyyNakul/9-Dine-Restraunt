import { MenuItem, Order, Reservation, Customer, AdminNotification, AdminSettings } from '../types';

const API_BASE = '/api';

export const apiService = {
  // Menu
  async getMenu(): Promise<MenuItem[]> {
    try {
      const res = await fetch(`${API_BASE}/menu`);
      const data = await res.json();
      return data.menu || [];
    } catch {
      return [];
    }
  },

  async addMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    const data = await res.json();
    return data.item;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return data.item;
  },

  async deleteMenuItem(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/menu/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  async toggleMenuAvailability(id: string): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/menu/${id}/toggle`, { method: 'PATCH' });
    const data = await res.json();
    return data.item;
  },

  // Orders
  async getOrders(search?: string, status?: string): Promise<Order[]> {
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (status) query.append('status', status);
      const res = await fetch(`${API_BASE}/orders?${query.toString()}`);
      const data = await res.json();
      return data.orders || [];
    } catch {
      return [];
    }
  },

  async placeOrder(orderData: Partial<Order>): Promise<{ success: boolean; order: Order }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  async updateOrderStatus(id: string, status: string, paymentStatus?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus })
    });
    const data = await res.json();
    return data.order;
  },

  async cancelOrder(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  // Reservations
  async getReservations(): Promise<Reservation[]> {
    try {
      const res = await fetch(`${API_BASE}/reservations`);
      const data = await res.json();
      return data.reservations || [];
    } catch {
      return [];
    }
  },

  async createReservation(resData: Partial<Reservation>): Promise<{ success: boolean; reservation: Reservation }> {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resData)
    });
    return res.json();
  },

  async updateReservationStatus(id: string, status: string, details?: Partial<Reservation>): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/reservations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...details })
    });
    const data = await res.json();
    return data.reservation;
  },

  async deleteReservation(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/reservations/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    try {
      const res = await fetch(`${API_BASE}/customers`);
      const data = await res.json();
      return data.customers || [];
    } catch {
      return [];
    }
  },

  // Notifications
  async getNotifications(): Promise<AdminNotification[]> {
    try {
      const res = await fetch(`${API_BASE}/notifications`);
      const data = await res.json();
      return data.notifications || [];
    } catch {
      return [];
    }
  },

  async markNotificationsRead(): Promise<boolean> {
    const res = await fetch(`${API_BASE}/notifications/read-all`, { method: 'PATCH' });
    const data = await res.json();
    return data.success;
  },

  // Settings
  async getSettings(): Promise<AdminSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      const data = await res.json();
      return data.settings;
    } catch {
      return {
        adminPhone: '+919876543210',
        autoSmsCustomer: true,
        autoSmsAdmin: true,
        mongodbConfigured: false,
        twilioConfigured: false
      };
    }
  },

  async updateSettings(settings: Partial<AdminSettings>): Promise<AdminSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    return data.settings;
  }
};
