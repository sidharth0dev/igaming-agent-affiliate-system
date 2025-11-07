'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function AgentSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['agent-settings'],
    queryFn: () => apiRequest<any>('/agent/settings'),
  });

  const changePassword = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      apiRequest('/agent/settings/password', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      alert('Password changed successfully');
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    changePassword.mutate({ currentPassword, newPassword });
  };

  return (
    <div className="flex">
      <Sidebar role="agent" />
      <div className="ml-64 flex-1 min-h-screen">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
            {data && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Code</label>
                  <input
                    type="text"
                    value={data.code}
                    disabled
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={data.name}
                    disabled
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={data.email}
                    disabled
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Wallet Balance</label>
                  <input
                    type="text"
                    value={`$${parseFloat(data.walletBalance || '0').toFixed(2)}`}
                    disabled
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Withdrawable Balance</label>
                  <input
                    type="text"
                    value={`$${parseFloat(data.withdrawableBalance || '0').toFixed(2)}`}
                    disabled
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-400"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                disabled={changePassword.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {changePassword.isPending ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

