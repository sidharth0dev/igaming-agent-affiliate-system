"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commissionLedgerResponseSchema = exports.commissionRuleSchema = void 0;
const zod_1 = require("zod");
exports.commissionRuleSchema = zod_1.z.object({
    ownerType: zod_1.z.enum(['agent', 'affiliate']),
    ownerId: zod_1.z.string().optional(),
    eventType: zod_1.z.string(),
    model: zod_1.z.enum(['percent', 'fixed', 'tiered']),
    value: zod_1.z.number().optional(),
    tiersJson: zod_1.z.record(zod_1.z.unknown()).optional(),
    currency: zod_1.z.string().default('USD'),
    active: zod_1.z.boolean(),
    startAt: zod_1.z.date().optional(),
    endAt: zod_1.z.date().optional(),
});
exports.commissionLedgerResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    ownerType: zod_1.z.string(),
    ownerId: zod_1.z.string(),
    period: zod_1.z.enum(['daily', 'weekly', 'monthly']),
    periodKey: zod_1.z.string(),
    currency: zod_1.z.string(),
    gross: zod_1.z.string(),
    adjustments: zod_1.z.string(),
    commission: zod_1.z.string(),
    createdAt: zod_1.z.date(),
});
//# sourceMappingURL=commission.js.map