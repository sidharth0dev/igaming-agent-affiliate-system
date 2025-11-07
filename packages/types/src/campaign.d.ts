import { z } from 'zod';
export declare const campaignResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    code: z.ZodString;
    ownerType: z.ZodEnum<["agent", "affiliate"]>;
    ownerId: z.ZodString;
    landingUrl: z.ZodNullable<z.ZodString>;
    geoAllowed: z.ZodArray<z.ZodString, "many">;
    deviceAllowed: z.ZodArray<z.ZodString, "many">;
    status: z.ZodString;
    startAt: z.ZodNullable<z.ZodDate>;
    endAt: z.ZodNullable<z.ZodDate>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    code: string;
    status: string;
    id: string;
    name: string;
    createdAt: Date;
    ownerType: "agent" | "affiliate";
    ownerId: string;
    landingUrl: string | null;
    geoAllowed: string[];
    deviceAllowed: string[];
    startAt: Date | null;
    endAt: Date | null;
}, {
    code: string;
    status: string;
    id: string;
    name: string;
    createdAt: Date;
    ownerType: "agent" | "affiliate";
    ownerId: string;
    landingUrl: string | null;
    geoAllowed: string[];
    deviceAllowed: string[];
    startAt: Date | null;
    endAt: Date | null;
}>;
export type CampaignResponse = z.infer<typeof campaignResponseSchema>;
//# sourceMappingURL=campaign.d.ts.map