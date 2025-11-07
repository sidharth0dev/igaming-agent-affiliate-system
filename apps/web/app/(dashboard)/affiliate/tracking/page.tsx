'use client';

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { DataTable } from '@igaming/ui';

export default function AffiliateTrackingPage() {
  const { data: clicks, isLoading: clicksLoading } = useQuery({
    queryKey: ['affiliate-tracking-clicks'],
    queryFn: () => apiRequest<any>('/reports/timeseries?groupBy=day'),
  });

  return (
    <div className="flex">
      <Sidebar role="affiliate" />
      <div className="ml-64 flex-1 min-h-screen">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Tracking</h1>
          
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Clicks</h2>
              {clicksLoading ? (
                <div className="text-gray-400">Loading...</div>
              ) : (
                <DataTable
                  data={clicks?.data?.slice(0, 10) || []}
                  columns={[
                    { key: 'period', header: 'Date' },
                    { key: 'clicks', header: 'Clicks' },
                    { key: 'registrations', header: 'Registrations' },
                    { key: 'deposits', header: 'Deposits' },
                  ]}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

