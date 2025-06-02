'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="outline"
        asChild
        className="text-sm border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
      >
        <Link href="/login">
          Увійти
        </Link>
      </Button>
      <Button
        asChild
        className="text-sm bg-blue-600 text-white hover:bg-blue-700"
      >
        <Link href="/register">
          Зареєструватися
        </Link>
      </Button>
    </div>
  );
} 