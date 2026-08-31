import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import * as authService from '@/services/auth.service';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser, setAuthenticated } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authService
        .getProfile()
        .then((user) => {
          setUser(user);
          setAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          setAuthenticated(false);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await authService.login(email, password);
    setUser(user);
    setAuthenticated(true);
    navigate('/dashboard');
  };

  const register = async (name: string, email: string, password: string) => {
    const { user } = await authService.register(name, email, password);
    setUser(user);
    setAuthenticated(true);
    navigate('/dashboard');
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: useAppStore.getState().isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
