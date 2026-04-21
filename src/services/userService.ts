import api from './api';
import { User, UserRole } from '../types';

// Helper to normalize backend fields
const normalizeUser = (u: any): User => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role as UserRole,
  businessName: u.businessName,
  category: u.category,
  location: u.location,
});

export const userService = {
  /** GET /api/users — admin/superadmin only */
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/api/users');
    return data.map(normalizeUser);
  },

  /** PATCH /api/users/:id — update profile */
  updateUser: async (id: string, payload: Partial<User>): Promise<User> => {
    const { data } = await api.patch(`/api/users/${id}`, {
      name: payload.name,
      businessName: payload.businessName,
      category: payload.category,
      location: payload.location,
    });
    return normalizeUser(data);
  },

  /** PATCH /api/users/:id/role — superadmin only */
  updateUserRole: async (id: string, role: UserRole): Promise<User> => {
    const { data } = await api.patch(`/api/users/${id}/role`, { role });
    return normalizeUser(data);
  },

  /** DELETE /api/users/:id — deactivate user */
  deactivateUser: async (id: string): Promise<void> => {
    await api.delete(`/api/users/${id}`);
  },
};
