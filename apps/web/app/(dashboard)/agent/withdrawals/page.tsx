'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { DataTable } from '@igaming/ui';

export default function AgentWithdrawalsPage() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['agent-withdrawals'],
    queryFn: () => apiRequest<any>('/agent/withdrawals'),
  });

  const createWithdrawal = useMutation({
    mutationFn: (data: { amount: number; method: string; currency: string }) =>
      apiRequest<any>('/agent/withdrawals', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['agent-dashboard'] });
      setAmount('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWithdrawal.mutate({
      amount: parseFloat(amount),
      method,
      currency: 'USD',
    });
  };

  const columns = [
    { key: 'amount', header: 'Amount' },
    { key: 'currency', header: 'Currency' },
    { key: 'method', header: 'Method' },
    { key: 'status', header: 'Status' },
    { key: 'createdAt', header: 'Created At', render: (row: any) => new Date(row.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="flex">
      <Sidebar role="agent" />
      <div className="ml-64 flex-1 min-h-screen">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Withdrawals</h1>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Request Withdrawal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={createWithdrawal.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {createWithdrawal.isPending ? 'Processing...' : 'Request Withdrawal'}
              </button>
            </form>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Withdrawal History</h2>
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

