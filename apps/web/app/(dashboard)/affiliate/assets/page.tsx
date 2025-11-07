'use client';

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function AffiliateAssetsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['affiliate-assets'],
    queryFn: () => apiRequest<any>('/affiliate/assets'),
  });

  return (
    <div className="flex">
      <Sidebar role="affiliate" />
      <div className="ml-64 flex-1 min-h-screen">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Marketing Assets</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="text-gray-400">Loading...</div>
            ) : (
              data?.data?.map((asset: any) => (
                <div key={asset.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{asset.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{asset.dimensions} - {asset.format}</p>
                  <div className="bg-gray-800 h-32 rounded mb-4 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Preview</span>
                  </div>
                  <a
                    href={asset.url}
                    download
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded text-sm"
                  >
                    Download
                  </a>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

