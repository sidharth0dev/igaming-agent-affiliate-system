import { z } from 'zod';
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const dateRangeSchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    from?: string | undefined;
    to?: string | undefined;
}, {
    from?: string | undefined;
    to?: string | undefined;
}>;
export declare const ownerTypeSchema: z.ZodEnum<["agent", "affiliate"]>;
export declare const statusSchema: z.ZodEnum<["pending", "approved", "rejected", "paid", "active", "inactive", "blocked"]>;
export declare const currencySchema: z.ZodDefault<z.ZodEnum<["USD", "EUR", "GBP"]>>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
export type OwnerType = z.infer<typeof ownerTypeSchema>;
export type Status = z.infer<typeof statusSchema>;
export type Currency = z.infer<typeof currencySchema>;
//# sourceMappingURL=common.d.ts.map