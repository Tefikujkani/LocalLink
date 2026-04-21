import api from './api';

export interface SystemStats {
  totalUsers: number;
  totalBusinesses: number;
  pendingModeration: number;
  totalLogs: number;
  totalTenants: number;
  databaseSize: string;
  storageUsed: string;
  systemStatus: string;
}

export interface Webhook {
  id: string;
  url: string;
  eventTypes: string; // From backend as CSV or string
  isActive: boolean;
  createdAt: string;
}

export const settingsService = {
  /** GET /api/settings/system-stats */
  getSystemStats: async (): Promise<SystemStats> => {
    const { data } = await api.get<SystemStats>('/api/settings/system-stats');
    return data;
  },

  /** GET /api/settings/webhooks */
  getWebhooks: async (): Promise<Webhook[]> => {
    const { data } = await api.get<Webhook[]>('/api/settings/webhooks');
    return data;
  },

  /** POST /api/settings/webhooks */
  createWebhook: async (url: string, eventTypes: string[]): Promise<Webhook> => {
    const { data } = await api.post<Webhook>('/api/settings/webhooks', { url, eventTypes });
    return data;
  },

  /** DELETE /api/settings/webhooks/:id */
  deleteWebhook: async (id: string): Promise<void> => {
    await api.delete(`/api/settings/webhooks/${id}`);
  }
};
