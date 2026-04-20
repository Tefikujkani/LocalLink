import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { User, UserRole } from '../types';
import toast from 'react-hot-toast';

// Mock Data Storage in LocalStorage for demo persists
const STORAGE_KEY = 'locallink_users';
const APP_USER_KEY = 'locallink_auth_user';
const TOKEN_KEY = 'locallink_token';

// Initial Mock Users
const INITIAL_USERS: User[] = [
  { id: '1', name: 'Super Admin', email: 'super@locallink.io', role: 'superadmin' },
  { id: '2', name: 'Admin Jane', email: 'admin@locallink.io', role: 'admin' },
  { id: '3', name: 'User Bob', email: 'user@locallink.io', role: 'user' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(APP_USER_KEY);
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Fake API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be a POST to /auth/login
      const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(INITIAL_USERS));
      const foundUser = users.find(u => u.email === email);

      if (foundUser && password === 'password') { // Simple secret for testing
        const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
        setToken(fakeToken);
        setUser(foundUser);
        localStorage.setItem(TOKEN_KEY, fakeToken);
        localStorage.setItem(APP_USER_KEY, JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
        
        // Redirect based on role
        if (foundUser.role === 'superadmin') navigate('/superadmin');
        else if (foundUser.role === 'admin') navigate('/admin');
        else navigate('/');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(INITIAL_USERS));
      if (users.some(u => u.email === data.email)) {
        throw new Error('User already exists');
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        role: 'user',
        businessName: data.businessName,
        category: data.category,
        location: data.location,
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(APP_USER_KEY);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
