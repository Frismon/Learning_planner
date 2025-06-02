"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthButtons } from '@/components/auth/AuthButtons';
import { ThemeToggle } from "@/components/theme-toggle";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
              Learning Planner
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/study-plan"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/study-plan')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Навчальний план
            </Link>
            <Link
              href="/calendar"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/calendar')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Календар
            </Link>
            <Link
              href="/tasks"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/tasks')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Завдання
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <AuthButtons />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 