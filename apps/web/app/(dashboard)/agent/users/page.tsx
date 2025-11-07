'use client';

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { DataTable } from '@igaming/ui';

export default function AgentUsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['agent-users'],
    queryFn: () => apiRequest<any>('/agent/users'),
  });

  const columns = [
    { key: 'username', header: 'Username' },
    { key: 'status', header: 'Status' },
    { key: 'country', header: 'Country' },
    { key: 'totalDeposits', header: 'Total Deposits' },
    { key: 'totalLosses', header: 'Total Losses' },
  ];

  return (
    <div className="flex">
      <Sidebar role="agent" />
      <div className="ml-64 flex-1 min-h-screen">
        <Header />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Users</h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
              Add User
            </button>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            {isLoading ? (
              <div className="text-gray-400">Loading...</div>
            ) : (
              <DataTable data={data?.data || []} columns={columns} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

