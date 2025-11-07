import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["admin", "agent", "affiliate", "player"]>;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    role: "admin" | "agent" | "affiliate" | "player";
    name?: string | undefined;
}, {
    email: string;
    password: string;
    role: "admin" | "agent" | "affiliate" | "player";
    name?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    refreshToken?: string | undefined;
}, {
    refreshToken?: string | undefined;
}>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export declare const userResponseSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<["admin", "agent", "affiliate", "player"]>;
    status: z.ZodString;
    lastLoginAt: z.ZodNullable<z.ZodDate>;
    twoFAEnabled: z.ZodBoolean;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    status: string;
    id: string;
    email: string;
    role: "admin" | "agent" | "affiliate" | "player";
    lastLoginAt: Date | null;
    twoFAEnabled: boolean;
    createdAt: Date;
}, {
    status: string;
    id: string;
    email: string;
    role: "admin" | "agent" | "affiliate" | "player";
    lastLoginAt: Date | null;
    twoFAEnabled: boolean;
    createdAt: Date;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
//# sourceMappingURL=auth.d.ts.map