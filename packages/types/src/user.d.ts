import { z } from 'zod';
export declare const createPlayerSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    username: string;
    email?: string | undefined;
    password?: string | undefined;
    country?: string | undefined;
}, {
    username: string;
    email?: string | undefined;
    password?: string | undefined;
    country?: string | undefined;
}>;
export declare const updatePlayerSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected", "paid", "active", "inactive", "blocked"]>>;
    country: z.ZodOptional<z.ZodString>;
    kycStatus: z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected", "paid", "active", "inactive", "blocked"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "active" | "pending" | "approved" | "rejected" | "paid" | "inactive" | "blocked" | undefined;
    country?: string | undefined;
    kycStatus?: "active" | "pending" | "approved" | "rejected" | "paid" | "inactive" | "blocked" | undefined;
}, {
    status?: "active" | "pending" | "approved" | "rejected" | "paid" | "inactive" | "blocked" | undefined;
    country?: string | undefined;
    kycStatus?: "active" | "pending" | "approved" | "rejected" | "paid" | "inactive" | "blocked" | undefined;
}>;
export declare const playerResponseSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    agentId: z.ZodNullable<z.ZodString>;
    status: z.ZodString;
    country: z.ZodNullable<z.ZodString>;
    kycStatus: z.ZodString;
    totalDeposits: z.ZodString;
    totalLosses: z.ZodString;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    status: string;
    id: string;
    createdAt: Date;
    username: string;
    country: string | null;
    kycStatus: string;
    agentId: string | null;
    totalDeposits: string;
    totalLosses: string;
}, {
    status: string;
    id: string;
    createdAt: Date;
    username: string;
    country: string | null;
    kycStatus: string;
    agentId: string | null;
    totalDeposits: string;
    totalLosses: string;
}>;
export declare const playersQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
} & {
    status: z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected", "paid", "active", "inactive", "blocked"]>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "active" | "pending" | "approved" | "rejected" | "paid" | "inactive" | "blocked" | undefined;
    search?: string | undefined;
}, {
    status?: "active" | "pending" | "approved" | "rejected" | "paid" | "inactive" | "blocked" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    search?: string | undefined;
}>;
export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;
export type PlayerResponse = z.infer<typeof playerResponseSchema>;
export type PlayersQuery = z.infer<typeof playersQuerySchema>;
//# sourceMappingURL=user.d.ts.map