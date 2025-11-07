import { z } from 'zod';

export const trackRegisterSchema = z.object({
  campaignCode: z.string().min(1),
  username: z.string().min(3),
  email: z.string().email().optional(),
  password: z.string().min(8),
  ip: z.string().optional(),
  ua: z.string().optional(),
});

export const trackDepositSchema = z.object({
  campaignCode: z.string().min(1),
  amount: z.coerce.number().positive(),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
  playerId: z.string().optional(),
  ip: z.string().optional(),
  ua: z.string().optional(),
});

export const trackingEventResponseSchema = z.object({
  id: z.string(),
  type: z.enum(['click', 'registration', 'deposit', 'loss', 'ftd']),
  playerId: z.string().nullable(),
  campaignId: z.string().nullable(),
  amount: z.string().nullable(),
  currency: z.string(),
  createdAt: z.date(),
});

export type TrackRegisterInput = z.infer<typeof trackRegisterSchema>;
export type TrackDepositInput = z.infer<typeof trackDepositSchema>;
export type TrackingEventResponse = z.infer<typeof trackingEventResponseSchema>;

