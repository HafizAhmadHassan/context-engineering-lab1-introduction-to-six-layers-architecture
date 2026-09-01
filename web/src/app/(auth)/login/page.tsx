'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Providers, useAuth } from './providers';
import { FlaskConical } from 'lucide-react';

export default function LoginPage() {
  return (
    <Providers>
      <LoginForm />
    </Providers>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <FlaskConical className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Context Engineering Lab</h1>
          <p className="text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-xl p-6">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-lg bg-secondary border border-input text-foreground"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-lg bg-secondary border border-input text-foreground"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>

          <div className="p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground text-center">
            Demo mode: use any credentials to sign in. Data is stored locally in your browser.
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
