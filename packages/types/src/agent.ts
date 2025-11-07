import { z } from 'zod';
import { dateRangeSchema } from './common';

export const agentDashboardResponseSchema = z.object({
  totalUsers: z.number(),
  totalRevenue: z.string(),
  pendingBalance: z.string(),
  withdrawableBalance: z.string(),
  earnings7Days: z.array(
    z.object({
      date: z.string(),
      amount: z.string(),
    })
  ),
});

export const agentEarningsQuerySchema = dateRangeSchema.extend({
  granularity: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
});

export const createWithdrawalSchema = z.object({
  amount: z.coerce.number().positive(),
  method: z.string().min(1),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
});

export const withdrawalResponseSchema = z.object({
  id: z.string(),
  ownerType: z.string(),
  ownerId: z.string(),
  amount: z.string(),
  currency: z.string(),
  method: z.string(),
  status: z.string(),
  reference: z.string().nullable(),
  createdAt: z.date(),
});

export type AgentDashboardResponse = z.infer<typeof agentDashboardResponseSchema>;
export type AgentEarningsQuery = z.infer<typeof agentEarningsQuerySchema>;
export type CreateWithdrawalInput = z.infer<typeof createWithdrawalSchema>;
export type WithdrawalResponse = z.infer<typeof withdrawalResponseSchema>;

