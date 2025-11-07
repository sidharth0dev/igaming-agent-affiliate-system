import { z } from 'zod';
export declare const affiliateDashboardResponseSchema: z.ZodObject<{
    clicks: z.ZodNumber;
    registrations: z.ZodNumber;
    ftds: z.ZodNumber;
    deposits: z.ZodNumber;
    revenue: z.ZodString;
    conversionChart: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        clicks: z.ZodNumber;
        registrations: z.ZodNumber;
        deposits: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        date: string;
        clicks: number;
        registrations: number;
        deposits: number;
    }, {
        date: string;
        clicks: number;
        registrations: number;
        deposits: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    clicks: number;
    registrations: number;
    ftds: number;
    deposits: number;
    revenue: string;
    conversionChart: {
        date: string;
        clicks: number;
        registrations: number;
        deposits: number;
    }[];
}, {
    clicks: number;
    registrations: number;
    ftds: number;
    deposits: number;
    revenue: string;
    conversionChart: {
        date: string;
        clicks: number;
        registrations: number;
        deposits: number;
    }[];
}>;
export declare const createLinkSchema: z.ZodObject<{
    name: z.ZodString;
    landingUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    landingUrl?: string | undefined;
}, {
    name: string;
    landingUrl?: string | undefined;
}>;
export declare const linkResponseSchema: z.ZodObject<{
    code: z.ZodString;
    url: z.ZodString;
    campaignId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    url: string;
    campaignId: string;
}, {
    code: string;
    url: string;
    campaignId: string;
}>;
export declare const assetResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    url: z.ZodString;
    dimensions: z.ZodString;
    format: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    url: string;
    dimensions: string;
    format: string;
}, {
    id: string;
    name: string;
    url: string;
    dimensions: string;
    format: string;
}>;
export type AffiliateDashboardResponse = z.infer<typeof affiliateDashboardResponseSchema>;
export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type LinkResponse = z.infer<typeof linkResponseSchema>;
export type AssetResponse = z.infer<typeof assetResponseSchema>;
//# sourceMappingURL=affiliate.d.ts.map