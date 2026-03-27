'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/admin/Navbar';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Don't protect the login page
  const isLoginPage = pathname === '/admin/login';

  // Redirect to login if not authenticated (except on login page)
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  // Show loading spinner while checking auth
  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If not authenticated and not on login page, don't render anything (will redirect)
  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  // If on login page, just show the page without navbar
  if (isLoginPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  // Authenticated users get the full layout with navbar
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
