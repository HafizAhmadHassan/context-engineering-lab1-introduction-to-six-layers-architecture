'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  useEffect(() => {
    if (authService.isLoggedIn()) {
      authService
        .getProfile()
        .then((u) => {
          setUser(u);
          setAuthenticated(true);
        })
        .catch(() => {
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
    router.push('/dashboard');
  };

  const register = async (name: string, email: string, password: string) => {
    const { user } = await authService.register(name, email, password);
    setUser(user);
    setAuthenticated(true);
    router.push('/dashboard');
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setAuthenticated(false);
    router.push('/login');
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

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
