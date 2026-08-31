import api from './api';
import type { User } from '@/types';

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('auth_token', data.token);
  return data;
}

export async function register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
  const { data } = await api.post('/auth/register', { name, email, password });
  localStorage.setItem('auth_token', data.token);
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get('/auth/profile');
  return data.user;
}

export async function getSettings(): Promise<any> {
  const { data } = await api.get('/settings');
  return data.settings;
}

export async function updateSettings(settings: Partial<any>): Promise<any> {
  const { data } = await api.put('/settings', settings);
  return data.settings;
}

export function logout(): void {
  localStorage.removeItem('auth_token');
}
