import { z } from 'zod';
export declare const overviewQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
} & {
    ownerType: z.ZodOptional<z.ZodEnum<["agent", "affiliate"]>>;
    ownerId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    from?: string | undefined;
    to?: string | undefined;
    ownerType?: "agent" | "affiliate" | undefined;
    ownerId?: string | undefined;
}, {
    from?: string | undefined;
    to?: string | undefined;
    ownerType?: "agent" | "affiliate" | undefined;
    ownerId?: string | undefined;
}>;
export declare const timeseriesQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
} & {
    ownerType: z.ZodOptional<z.ZodEnum<["agent", "affiliate"]>>;
    ownerId: z.ZodOptional<z.ZodString>;
} & {
    groupBy: z.ZodDefault<z.ZodEnum<["campaign", "day"]>>;
}, "strip", z.ZodTypeAny, {
    groupBy: "day" | "campaign";
    from?: string | undefined;
    to?: string | undefined;
    ownerType?: "agent" | "affiliate" | undefined;
    ownerId?: string | undefined;
}, {
    from?: string | undefined;
    to?: string | undefined;
    ownerType?: "agent" | "affiliate" | undefined;
    ownerId?: string | undefined;
    groupBy?: "day" | "campaign" | undefined;
}>;
export declare const topCampaignsQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
} & {
    ownerType: z.ZodOptional<z.ZodEnum<["agent", "affiliate"]>>;
    ownerId: z.ZodOptional<z.ZodString>;
} & {
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    from?: string | undefined;
    to?: string | undefined;
    ownerType?: "agent" | "affiliate" | undefined;
    ownerId?: string | undefined;
}, {
    limit?: number | undefined;
    from?: string | undefined;
    to?: string | undefined;
    ownerType?: "agent" | "affiliate" | undefined;
    ownerId?: string | undefined;
}>;
export declare const overviewResponseSchema: z.ZodObject<{
    totalClicks: z.ZodNumber;
    totalRegistrations: z.ZodNumber;
    totalDeposits: z.ZodNumber;
    totalRevenue: z.ZodString;
    totalCommissions: z.ZodString;
}, "strip", z.ZodTypeAny, {
    totalDeposits: number;
    totalRevenue: string;
    totalClicks: number;
    totalRegistrations: number;
    totalCommissions: string;
}, {
    totalDeposits: number;
    totalRevenue: string;
    totalClicks: number;
    totalRegistrations: number;
    totalCommissions: string;
}>;
export declare const timeseriesResponseSchema: z.ZodArray<z.ZodObject<{
    period: z.ZodString;
    clicks: z.ZodNumber;
    registrations: z.ZodNumber;
    deposits: z.ZodNumber;
    revenue: z.ZodString;
    commissions: z.ZodString;
}, "strip", z.ZodTypeAny, {
    clicks: number;
    registrations: number;
    deposits: number;
    revenue: string;
    period: string;
    commissions: string;
}, {
    clicks: number;
    registrations: number;
    deposits: number;
    revenue: string;
    period: string;
    commissions: string;
}>, "many">;
export declare const topCampaignResponseSchema: z.ZodObject<{
    campaignId: z.ZodString;
    campaignName: z.ZodString;
    clicks: z.ZodNumber;
    registrations: z.ZodNumber;
    deposits: z.ZodNumber;
    revenue: z.ZodString;
}, "strip", z.ZodTypeAny, {
    clicks: number;
    registrations: number;
    deposits: number;
    revenue: string;
    campaignId: string;
    campaignName: string;
}, {
    clicks: number;
    registrations: number;
    deposits: number;
    revenue: string;
    campaignId: string;
    campaignName: string;
}>;
export type OverviewQuery = z.infer<typeof overviewQuerySchema>;
export type TimeseriesQuery = z.infer<typeof timeseriesQuerySchema>;
export type TopCampaignsQuery = z.infer<typeof topCampaignsQuerySchema>;
export type OverviewResponse = z.infer<typeof overviewResponseSchema>;
export type TimeseriesResponse = z.infer<typeof timeseriesResponseSchema>;
export type TopCampaignResponse = z.infer<typeof topCampaignResponseSchema>;
//# sourceMappingURL=reports.d.ts.map