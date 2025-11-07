'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function AffiliateLinksPage() {
  const [name, setName] = useState('');
  const [landingUrl, setLandingUrl] = useState('');
  const queryClient = useQueryClient();

  const createLink = useMutation({
    mutationFn: (data: { name: string; landingUrl?: string }) =>
      apiRequest<any>('/affiliate/links', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-links'] });
      setName('');
      setLandingUrl('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLink.mutate({ name, landingUrl: landingUrl || undefined });
  };

  return (
    <div className="flex">
      <Sidebar role="affiliate" />
      <div className="ml-64 flex-1 min-h-screen">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Referral Links</h1>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Generate New Link</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Landing URL (optional)</label>
                <input
                  type="url"
                  value={landingUrl}
                  onChange={(e) => setLandingUrl(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={createLink.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {createLink.isPending ? 'Creating...' : 'Generate Link'}
              </button>
            </form>
          </div>

          {createLink.isSuccess && createLink.data && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Link Created!</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={createLink.data.url}
                  readOnly
                  className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(createLink.data.url)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

