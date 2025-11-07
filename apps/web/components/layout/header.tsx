'use client';

import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

export function Header({ user }: { user?: { email: string; role: string } }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <input
          type="date"
          className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white"
        />
        <span className="text-gray-400 text-sm">to</span>
        <input
          type="date"
          className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white"
        />
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm text-gray-400">
            {user.email} ({user.role})
          </div>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

