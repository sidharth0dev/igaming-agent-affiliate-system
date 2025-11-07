'use client';

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { KPICard } from '@igaming/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AffiliateDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['affiliate-dashboard'],
    queryFn: () => apiRequest<any>('/affiliate/dashboard'),
  });

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar role="affiliate" />
        <div className="ml-64 flex-1">
          <Header />
          <div className="p-6">Loading...</div>
        </div>
      </div>
    );
  }

  const chartData = data?.conversionChart || [];

  return (
    <div className="flex">
      <Sidebar role="affiliate" />
      <div className="ml-64 flex-1 min-h-screen">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <KPICard
              title="Clicks"
              value={data?.clicks || 0}
            />
            <KPICard
              title="Registrations"
              value={data?.registrations || 0}
            />
            <KPICard
              title="FTDs"
              value={data?.ftds || 0}
            />
            <KPICard
              title="Deposits"
              value={data?.deposits || 0}
            />
            <KPICard
              title="Revenue"
              value={`$${parseFloat(data?.revenue || '0').toFixed(2)}`}
            />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '4px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} name="Clicks" />
                <Line type="monotone" dataKey="registrations" stroke="#10B981" strokeWidth={2} name="Registrations" />
                <Line type="monotone" dataKey="deposits" stroke="#F59E0B" strokeWidth={2} name="Deposits" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
}

