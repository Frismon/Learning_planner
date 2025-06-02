'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import AuthButtons from './AuthButtons';

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-blue-500">
              Learning Planner
            </Link>
            
            {user && (
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/tasks"
                  className={`nav-link ${isActive('/tasks') ? 'nav-link-active' : ''}`}
                >
                  Завдання
                </Link>
                <Link
                  href="/plans"
                  className={`nav-link ${isActive('/plans') ? 'nav-link-active' : ''}`}
                >
                  Плани
                </Link>
                <Link
                  href="/settings"
                  className={`nav-link ${isActive('/settings') ? 'nav-link-active' : ''}`}
                >
                  Налаштування
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <AuthButtons />
          </div>
        </div>
      </div>
    </nav>
  );
} 