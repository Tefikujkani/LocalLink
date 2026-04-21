import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { User } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 2FA state
  const [isTwoFactorStep, setIsTwoFactorStep] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);

  const navigate = useNavigate();

  // ─── On Mount: Restore session ─────────────────────────────────────────────
  useEffect(() => {
    const savedToken = authService.getSavedToken();
    const savedUser = authService.getSavedUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);

      authService
        .getMe()
        .then((freshUser) => {
          setUser(freshUser);
        })
        .catch(() => {
          authService.clearSession();
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const resetAuthFlow = useCallback(() => {
    setIsTwoFactorStep(false);
    setTempToken(null);
    setIsLoading(false);
  }, []);

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      
      if (result.type === '2FA_REQUIRED') {
        setIsTwoFactorStep(true);
        setTempToken(result.tempToken);
        toast('Please enter your 2FA code to continue', { icon: '🛡️' });
      } else {
        const { token: newToken, user: loggedInUser } = result;
        setToken(newToken);
        setUser(loggedInUser);
        toast.success(`Welcome back, ${loggedInUser.name}! 👋`);
        
        if (loggedInUser.role === 'superadmin') navigate('/superadmin');
        else if (loggedInUser.role === 'admin') navigate('/admin');
        else navigate('/dashboard');
      }
    } catch (error: any) {
      const message = error?.response?.data?.detail || 'Login failed.';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // ─── Verify 2FA ──────────────────────────────────────────────────────────
  const verify2FA = useCallback(async (otpToken: string) => {
    if (!tempToken) return;
    setIsLoading(true);
    try {
      const { token: newToken, user: loggedInUser } = await authService.verify2FA(otpToken, tempToken);
      setToken(newToken);
      setUser(loggedInUser);
      setIsTwoFactorStep(false);
      setTempToken(null);
      
      toast.success('Identity verified! Access granted.');
      
      if (loggedInUser.role === 'superadmin') navigate('/superadmin');
      else if (loggedInUser.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (error: any) {
      const message = error?.response?.data?.detail || 'Verification failed.';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [tempToken, navigate]);

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        businessName: data.businessName,
        category: data.category,
        location: data.location,
      });
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (error: any) {
      const message = error?.response?.data?.detail || 'Registration failed.';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    authService.clearSession();
    setToken(null);
    setUser(null);
    setIsTwoFactorStep(false);
    setTempToken(null);
    toast.success('Logged out successfully.');
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ 
        user, token, isAuthenticated: !!token, isLoading, 
        login, register, logout, 
        isTwoFactorStep, verify2FA, resetAuthFlow 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
