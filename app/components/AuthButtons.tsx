'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthButtons() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">{user.email}</span>
        <button
          onClick={handleLogout}
          className="btn btn-danger"
        >
          Вийти
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => router.push('/login')}
        className="btn btn-primary"
      >
        Увійти
      </button>
      <button
        onClick={() => router.push('/register')}
        className="btn btn-secondary"
      >
        Зареєструватися
      </button>
    </div>
  );
} 