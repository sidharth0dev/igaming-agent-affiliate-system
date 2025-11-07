import { z } from 'zod';
import { paginationSchema, statusSchema } from './common';

export const createPlayerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().optional(),
  country: z.string().optional(),
  password: z.string().min(8).optional(),
});

export const updatePlayerSchema = z.object({
  status: statusSchema.optional(),
  country: z.string().optional(),
  kycStatus: statusSchema.optional(),
});

export const playerResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  agentId: z.string().nullable(),
  status: z.string(),
  country: z.string().nullable(),
  kycStatus: z.string(),
  totalDeposits: z.string(),
  totalLosses: z.string(),
  createdAt: z.date(),
});

export const playersQuerySchema = paginationSchema.extend({
  status: statusSchema.optional(),
  search: z.string().optional(),
});

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;
export type PlayerResponse = z.infer<typeof playerResponseSchema>;
export type PlayersQuery = z.infer<typeof playersQuerySchema>;

