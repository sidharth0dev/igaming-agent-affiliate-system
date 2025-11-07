import { z } from 'zod';
export declare const commissionRuleSchema: z.ZodObject<{
    ownerType: z.ZodEnum<["agent", "affiliate"]>;
    ownerId: z.ZodOptional<z.ZodString>;
    eventType: z.ZodString;
    model: z.ZodEnum<["percent", "fixed", "tiered"]>;
    value: z.ZodOptional<z.ZodNumber>;
    tiersJson: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    currency: z.ZodDefault<z.ZodString>;
    active: z.ZodBoolean;
    startAt: z.ZodOptional<z.ZodDate>;
    endAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    active: boolean;
    currency: string;
    ownerType: "agent" | "affiliate";
    eventType: string;
    model: "percent" | "fixed" | "tiered";
    value?: number | undefined;
    ownerId?: string | undefined;
    startAt?: Date | undefined;
    endAt?: Date | undefined;
    tiersJson?: Record<string, unknown> | undefined;
}, {
    active: boolean;
    ownerType: "agent" | "affiliate";
    eventType: string;
    model: "percent" | "fixed" | "tiered";
    value?: number | undefined;
    currency?: string | undefined;
    ownerId?: string | undefined;
    startAt?: Date | undefined;
    endAt?: Date | undefined;
    tiersJson?: Record<string, unknown> | undefined;
}>;
export declare const commissionLedgerResponseSchema: z.ZodObject<{
    id: z.ZodString;
    ownerType: z.ZodString;
    ownerId: z.ZodString;
    period: z.ZodEnum<["daily", "weekly", "monthly"]>;
    periodKey: z.ZodString;
    currency: z.ZodString;
    gross: z.ZodString;
    adjustments: z.ZodString;
    commission: z.ZodString;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    currency: string;
    ownerType: string;
    ownerId: string;
    period: "daily" | "weekly" | "monthly";
    periodKey: string;
    gross: string;
    adjustments: string;
    commission: string;
}, {
    id: string;
    createdAt: Date;
    currency: string;
    ownerType: string;
    ownerId: string;
    period: "daily" | "weekly" | "monthly";
    periodKey: string;
    gross: string;
    adjustments: string;
    commission: string;
}>;
export type CommissionRule = z.infer<typeof commissionRuleSchema>;
export type CommissionLedgerResponse = z.infer<typeof commissionLedgerResponseSchema>;
//# sourceMappingURL=commission.d.ts.map