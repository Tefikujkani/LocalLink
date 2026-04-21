
export type UserRole = 'user' | 'admin' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  businessName?: string;
  category?: string;
  location?: string;
  is2faEnabled?: boolean;
}

export type BusinessStatus = 'pending' | 'approved' | 'rejected';

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  lat: number;
  lng: number;
  status: BusinessStatus;
  createdAt: string;
  imageUrl?: string;
  rating?: number;
  locationName?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
