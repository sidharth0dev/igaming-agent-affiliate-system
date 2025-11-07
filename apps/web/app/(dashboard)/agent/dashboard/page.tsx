'use client';

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { KPICard } from '@igaming/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AgentDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['agent-dashboard'],
    queryFn: () => apiRequest<any>('/agent/dashboard'),
  });

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar role="agent" />
        <div className="ml-64 flex-1">
          <Header />
          <div className="p-6">Loading...</div>
        </div>
      </div>
    );
  }

  const chartData = data?.earnings7Days || [];

  return (
    <div className="flex">
      <Sidebar role="agent" />
      <div className="ml-64 flex-1 min-h-screen">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPICard
              title="Total Users"
              value={data?.totalUsers || 0}
            />
            <KPICard
              title="Total Revenue"
              value={`$${parseFloat(data?.totalRevenue || '0').toFixed(2)}`}
            />
            <KPICard
              title="Pending Balance"
              value={`$${parseFloat(data?.pendingBalance || '0').toFixed(2)}`}
            />
            <KPICard
              title="Withdrawable"
              value={`$${parseFloat(data?.withdrawableBalance || '0').toFixed(2)}`}
            />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">7-Day Earnings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '4px' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
}

