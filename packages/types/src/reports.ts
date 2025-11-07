import { z } from 'zod';
import { dateRangeSchema, ownerTypeSchema } from './common';

export const overviewQuerySchema = dateRangeSchema.extend({
  ownerType: ownerTypeSchema.optional(),
  ownerId: z.string().optional(),
});

export const timeseriesQuerySchema = overviewQuerySchema.extend({
  groupBy: z.enum(['campaign', 'day']).default('day'),
});

export const topCampaignsQuerySchema = overviewQuerySchema.extend({
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const overviewResponseSchema = z.object({
  totalClicks: z.number(),
  totalRegistrations: z.number(),
  totalDeposits: z.number(),
  totalRevenue: z.string(),
  totalCommissions: z.string(),
});

export const timeseriesResponseSchema = z.array(
  z.object({
    period: z.string(),
    clicks: z.number(),
    registrations: z.number(),
    deposits: z.number(),
    revenue: z.string(),
    commissions: z.string(),
  })
);

export const topCampaignResponseSchema = z.object({
  campaignId: z.string(),
  campaignName: z.string(),
  clicks: z.number(),
  registrations: z.number(),
  deposits: z.number(),
  revenue: z.string(),
});

export type OverviewQuery = z.infer<typeof overviewQuerySchema>;
export type TimeseriesQuery = z.infer<typeof timeseriesQuerySchema>;
export type TopCampaignsQuery = z.infer<typeof topCampaignsQuerySchema>;
export type OverviewResponse = z.infer<typeof overviewResponseSchema>;
export type TimeseriesResponse = z.infer<typeof timeseriesResponseSchema>;
export type TopCampaignResponse = z.infer<typeof topCampaignResponseSchema>;

