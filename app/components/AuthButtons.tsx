'use client';

import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export function AuthButtons() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <button
          onClick={logout}
          className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Вийти
        </button>
      ) : (
        <>
          <Link
            href="/login"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Увійти
          </Link>
          <Link
            href="/register"
            className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            Зареєструватися
          </Link>
        </>
      )}
    </div>
  );
} 