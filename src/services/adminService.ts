import api from './api';
import { User, Business } from '../types';

export const adminService = {
  /** GET /api/users — list all users (SuperAdmin/Admin only) */
  getAllUsers: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/api/users');
    return data;
  },

  /** PATCH /api/users/:id/role — change user role (SuperAdmin only) */
  updateUserRole: async (userId: string, role: string): Promise<User> => {
    const { data } = await api.patch<User>(`/api/users/${userId}/role`, { role });
    return data;
  },

  /** DELETE /api/users/:id — deactivate user */
  deactivateUser: async (userId: string): Promise<void> => {
    await api.delete(`/api/users/${userId}`);
  },

  /** GET /api/businesses?status=all — moderation queue */
  getModerationQueue: async (status: string = 'pending'): Promise<Business[]> => {
    const { data } = await api.get<Business[]>('/api/businesses', {
      params: { status }
    });
    return data;
  }
};
