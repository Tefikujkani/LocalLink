import { User } from '../types';
import api, { TOKEN_KEY } from './api';

const USER_KEY = 'locallink_auth_user';

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  twoFactorRequired?: boolean;
  tempToken?: string;
}

export type LoginResult = 
  | { type: 'SUCCESS'; token: string; user: User }
  | { type: '2FA_REQUIRED'; tempToken: string };

export const authService = {
  /**
   * POST /api/auth/login
   * Returns success result OR requires 2FA code.
   */
  login: async (email: string, password: string): Promise<LoginResult> => {
    const { data } = await api.post<LoginResponse>('/api/auth/login', { email, password });
    
    if (data.twoFactorRequired) {
      return { type: '2FA_REQUIRED', tempToken: data.tempToken! };
    }

    const token = data.accessToken;
    localStorage.setItem(TOKEN_KEY, token);
    const user = await authService.getMe();
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return { type: 'SUCCESS', token, user };
  },

  /**
   * POST /api/security/2fa/verify
   */
  verify2FA: async (token: string, tempToken: string): Promise<{ token: string; user: User }> => {
    const { data } = await api.post<LoginResponse>('/api/security/2fa/verify', { 
      token, 
      tempToken: tempToken 
    });
    
    const finalToken = data.accessToken;
    localStorage.setItem(TOKEN_KEY, finalToken);
    const user = await authService.getMe();
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return { token: finalToken, user };
  },

  /**
   * POST /api/auth/register
   */
  register: async (payload: {
    name: string;
    email: string;
    password: string;
    businessName?: string;
    category?: string;
    location?: string;
  }): Promise<User> => {
    const { data } = await api.post<User>('/api/auth/register', payload);
    return data;
  },

  /**
   * GET /api/auth/me
   */
  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>('/api/auth/me');
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      businessName: (data as any).businessName,
      category: data.category,
      location: data.location,
    } as User;
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getSavedUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  getSavedToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
};
