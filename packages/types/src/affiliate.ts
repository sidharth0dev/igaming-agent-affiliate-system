import { z } from 'zod';

export const affiliateDashboardResponseSchema = z.object({
  clicks: z.number(),
  registrations: z.number(),
  ftds: z.number(),
  deposits: z.number(),
  revenue: z.string(),
  conversionChart: z.array(
    z.object({
      date: z.string(),
      clicks: z.number(),
      registrations: z.number(),
      deposits: z.number(),
    })
  ),
});

export const createLinkSchema = z.object({
  name: z.string().min(1),
  landingUrl: z.string().url().optional(),
});

export const linkResponseSchema = z.object({
  code: z.string(),
  url: z.string(),
  campaignId: z.string(),
});

export const assetResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  dimensions: z.string(),
  format: z.string(),
});

export type AffiliateDashboardResponse = z.infer<typeof affiliateDashboardResponseSchema>;
export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type LinkResponse = z.infer<typeof linkResponseSchema>;
export type AssetResponse = z.infer<typeof assetResponseSchema>;

