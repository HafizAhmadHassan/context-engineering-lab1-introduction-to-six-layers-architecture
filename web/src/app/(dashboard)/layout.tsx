'use client';

import { AuthProvider, ProtectedRoute } from '@/context/AuthContext';
import { MainLayout } from '@/layouts/MainLayout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <MainLayout>{children}</MainLayout>
      </ProtectedRoute>
    </AuthProvider>
  );
}
