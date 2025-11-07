import { z } from 'zod';

export const commissionRuleSchema = z.object({
  ownerType: z.enum(['agent', 'affiliate']),
  ownerId: z.string().optional(),
  eventType: z.string(),
  model: z.enum(['percent', 'fixed', 'tiered']),
  value: z.number().optional(),
  tiersJson: z.record(z.unknown()).optional(),
  currency: z.string().default('USD'),
  active: z.boolean(),
  startAt: z.date().optional(),
  endAt: z.date().optional(),
});

export const commissionLedgerResponseSchema = z.object({
  id: z.string(),
  ownerType: z.string(),
  ownerId: z.string(),
  period: z.enum(['daily', 'weekly', 'monthly']),
  periodKey: z.string(),
  currency: z.string(),
  gross: z.string(),
  adjustments: z.string(),
  commission: z.string(),
  createdAt: z.date(),
});

export type CommissionRule = z.infer<typeof commissionRuleSchema>;
export type CommissionLedgerResponse = z.infer<typeof commissionLedgerResponseSchema>;

