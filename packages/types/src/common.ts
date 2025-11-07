import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const ownerTypeSchema = z.enum(['agent', 'affiliate']);

export const statusSchema = z.enum(['pending', 'approved', 'rejected', 'paid', 'active', 'inactive', 'blocked']);

export const currencySchema = z.enum(['USD', 'EUR', 'GBP']).default('USD');

export type PaginationInput = z.infer<typeof paginationSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
export type OwnerType = z.infer<typeof ownerTypeSchema>;
export type Status = z.infer<typeof statusSchema>;
export type Currency = z.infer<typeof currencySchema>;

