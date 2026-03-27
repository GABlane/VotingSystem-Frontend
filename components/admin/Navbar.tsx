'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <nav className="border-b border-border bg-surface/50 nav-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/admin/dashboard" className="text-xl font-bold">
              Voting Admin
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/admin/dashboard"
                className="text-secondary hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/projects"
                className="text-secondary hover:text-primary transition-colors"
              >
                Projects
              </Link>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-secondary text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
