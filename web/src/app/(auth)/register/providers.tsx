'use client';

import { AuthProvider, useAuth } from '@/context/AuthContext';

export { useAuth };
export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
