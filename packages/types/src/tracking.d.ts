import { z } from 'zod';
export declare const trackRegisterSchema: z.ZodObject<{
    campaignCode: z.ZodString;
    username: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
    ip: z.ZodOptional<z.ZodString>;
    ua: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    password: string;
    username: string;
    campaignCode: string;
    email?: string | undefined;
    ip?: string | undefined;
    ua?: string | undefined;
}, {
    password: string;
    username: string;
    campaignCode: string;
    email?: string | undefined;
    ip?: string | undefined;
    ua?: string | undefined;
}>;
export declare const trackDepositSchema: z.ZodObject<{
    campaignCode: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["USD", "EUR", "GBP"]>>;
    playerId: z.ZodOptional<z.ZodString>;
    ip: z.ZodOptional<z.ZodString>;
    ua: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    currency: "USD" | "EUR" | "GBP";
    campaignCode: string;
    ip?: string | undefined;
    ua?: string | undefined;
    playerId?: string | undefined;
}, {
    amount: number;
    campaignCode: string;
    currency?: "USD" | "EUR" | "GBP" | undefined;
    ip?: string | undefined;
    ua?: string | undefined;
    playerId?: string | undefined;
}>;
export declare const trackingEventResponseSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["click", "registration", "deposit", "loss", "ftd"]>;
    playerId: z.ZodNullable<z.ZodString>;
    campaignId: z.ZodNullable<z.ZodString>;
    amount: z.ZodNullable<z.ZodString>;
    currency: z.ZodString;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    type: "click" | "registration" | "deposit" | "loss" | "ftd";
    id: string;
    createdAt: Date;
    amount: string | null;
    currency: string;
    campaignId: string | null;
    playerId: string | null;
}, {
    type: "click" | "registration" | "deposit" | "loss" | "ftd";
    id: string;
    createdAt: Date;
    amount: string | null;
    currency: string;
    campaignId: string | null;
    playerId: string | null;
}>;
export type TrackRegisterInput = z.infer<typeof trackRegisterSchema>;
export type TrackDepositInput = z.infer<typeof trackDepositSchema>;
export type TrackingEventResponse = z.infer<typeof trackingEventResponseSchema>;
//# sourceMappingURL=tracking.d.ts.map