import { z } from 'zod';
export declare const updateWithdrawalSchema: z.ZodObject<{
    status: z.ZodEnum<["pending", "approved", "rejected", "paid"]>;
    reference: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "approved" | "rejected" | "paid";
    reference?: string | undefined;
}, {
    status: "pending" | "approved" | "rejected" | "paid";
    reference?: string | undefined;
}>;
export declare const withdrawalsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
} & {
    status: z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected", "paid"]>>;
    ownerType: z.ZodOptional<z.ZodEnum<["agent", "affiliate"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "pending" | "approved" | "rejected" | "paid" | undefined;
    ownerType?: "agent" | "affiliate" | undefined;
}, {
    status?: "pending" | "approved" | "rejected" | "paid" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    ownerType?: "agent" | "affiliate" | undefined;
}>;
export type UpdateWithdrawalInput = z.infer<typeof updateWithdrawalSchema>;
export type WithdrawalsQuery = z.infer<typeof withdrawalsQuerySchema>;
//# sourceMappingURL=withdrawal.d.ts.map