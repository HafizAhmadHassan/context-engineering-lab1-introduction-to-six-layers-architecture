'use client';

import type { User } from '@/types';

const TOKEN_KEY = 'ce_lab_auth_token';
const USER_KEY = 'ce_lab_auth_user';

const DEMO_USER: User = { id: '1', name: 'Demo User', email: 'demo@example.com' };

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  await new Promise((r) => setTimeout(r, 500));
  const token = 'demo-token-' + Date.now();
  const user: User = { ...DEMO_USER, email };
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { token, user };
}

export async function register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
  await new Promise((r) => setTimeout(r, 500));
  const token = 'demo-token-' + Date.now();
  const user: User = { id: '1', name, email };
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { token, user };
}

export async function getProfile(): Promise<User> {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw) as User;
  } catch {}
  return DEMO_USER;
}

export function isLoggedIn(): boolean {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
