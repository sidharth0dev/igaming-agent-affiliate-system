import { z } from 'zod';
import { paginationSchema } from './common';

export const updateWithdrawalSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'paid']),
  reference: z.string().optional(),
});

export const withdrawalsQuerySchema = paginationSchema.extend({
  status: z.enum(['pending', 'approved', 'rejected', 'paid']).optional(),
  ownerType: z.enum(['agent', 'affiliate']).optional(),
});

export type UpdateWithdrawalInput = z.infer<typeof updateWithdrawalSchema>;
export type WithdrawalsQuery = z.infer<typeof withdrawalsQuerySchema>;

