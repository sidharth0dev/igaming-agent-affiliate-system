import { z } from 'zod';
export declare const agentDashboardResponseSchema: z.ZodObject<{
    totalUsers: z.ZodNumber;
    totalRevenue: z.ZodString;
    pendingBalance: z.ZodString;
    withdrawableBalance: z.ZodString;
    earnings7Days: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        amount: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: string;
        amount: string;
    }, {
        date: string;
        amount: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    totalUsers: number;
    totalRevenue: string;
    pendingBalance: string;
    withdrawableBalance: string;
    earnings7Days: {
        date: string;
        amount: string;
    }[];
}, {
    totalUsers: number;
    totalRevenue: string;
    pendingBalance: string;
    withdrawableBalance: string;
    earnings7Days: {
        date: string;
        amount: string;
    }[];
}>;
export declare const agentEarningsQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
} & {
    granularity: z.ZodDefault<z.ZodEnum<["daily", "weekly", "monthly"]>>;
}, "strip", z.ZodTypeAny, {
    granularity: "daily" | "weekly" | "monthly";
    from?: string | undefined;
    to?: string | undefined;
}, {
    from?: string | undefined;
    to?: string | undefined;
    granularity?: "daily" | "weekly" | "monthly" | undefined;
}>;
export declare const createWithdrawalSchema: z.ZodObject<{
    amount: z.ZodNumber;
    method: z.ZodString;
    currency: z.ZodDefault<z.ZodEnum<["USD", "EUR", "GBP"]>>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    method: string;
    currency: "USD" | "EUR" | "GBP";
}, {
    amount: number;
    method: string;
    currency?: "USD" | "EUR" | "GBP" | undefined;
}>;
export declare const withdrawalResponseSchema: z.ZodObject<{
    id: z.ZodString;
    ownerType: z.ZodString;
    ownerId: z.ZodString;
    amount: z.ZodString;
    currency: z.ZodString;
    method: z.ZodString;
    status: z.ZodString;
    reference: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    status: string;
    id: string;
    createdAt: Date;
    amount: string;
    method: string;
    currency: string;
    ownerType: string;
    ownerId: string;
    reference: string | null;
}, {
    status: string;
    id: string;
    createdAt: Date;
    amount: string;
    method: string;
    currency: string;
    ownerType: string;
    ownerId: string;
    reference: string | null;
}>;
export type AgentDashboardResponse = z.infer<typeof agentDashboardResponseSchema>;
export type AgentEarningsQuery = z.infer<typeof agentEarningsQuerySchema>;
export type CreateWithdrawalInput = z.infer<typeof createWithdrawalSchema>;
export type WithdrawalResponse = z.infer<typeof withdrawalResponseSchema>;
//# sourceMappingURL=agent.d.ts.map