import { z } from 'zod';

export const campaignResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  ownerType: z.enum(['agent', 'affiliate']),
  ownerId: z.string(),
  landingUrl: z.string().nullable(),
  geoAllowed: z.array(z.string()),
  deviceAllowed: z.array(z.string()),
  status: z.string(),
  startAt: z.date().nullable(),
  endAt: z.date().nullable(),
  createdAt: z.date(),
});

export type CampaignResponse = z.infer<typeof campaignResponseSchema>;

