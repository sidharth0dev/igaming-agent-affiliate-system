"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackingEventResponseSchema = exports.trackDepositSchema = exports.trackRegisterSchema = void 0;
const zod_1 = require("zod");
exports.trackRegisterSchema = zod_1.z.object({
    campaignCode: zod_1.z.string().min(1),
    username: zod_1.z.string().min(3),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(8),
    ip: zod_1.z.string().optional(),
    ua: zod_1.z.string().optional(),
});
exports.trackDepositSchema = zod_1.z.object({
    campaignCode: zod_1.z.string().min(1),
    amount: zod_1.z.coerce.number().positive(),
    currency: zod_1.z.enum(['USD', 'EUR', 'GBP']).default('USD'),
    playerId: zod_1.z.string().optional(),
    ip: zod_1.z.string().optional(),
    ua: zod_1.z.string().optional(),
});
exports.trackingEventResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.enum(['click', 'registration', 'deposit', 'loss', 'ftd']),
    playerId: zod_1.z.string().nullable(),
    campaignId: zod_1.z.string().nullable(),
    amount: zod_1.z.string().nullable(),
    currency: zod_1.z.string(),
    createdAt: zod_1.z.date(),
});
//# sourceMappingURL=tracking.js.map