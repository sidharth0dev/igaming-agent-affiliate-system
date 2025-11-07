"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawalResponseSchema = exports.createWithdrawalSchema = exports.agentEarningsQuerySchema = exports.agentDashboardResponseSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.agentDashboardResponseSchema = zod_1.z.object({
    totalUsers: zod_1.z.number(),
    totalRevenue: zod_1.z.string(),
    pendingBalance: zod_1.z.string(),
    withdrawableBalance: zod_1.z.string(),
    earnings7Days: zod_1.z.array(zod_1.z.object({
        date: zod_1.z.string(),
        amount: zod_1.z.string(),
    })),
});
exports.agentEarningsQuerySchema = common_1.dateRangeSchema.extend({
    granularity: zod_1.z.enum(['daily', 'weekly', 'monthly']).default('daily'),
});
exports.createWithdrawalSchema = zod_1.z.object({
    amount: zod_1.z.coerce.number().positive(),
    method: zod_1.z.string().min(1),
    currency: zod_1.z.enum(['USD', 'EUR', 'GBP']).default('USD'),
});
exports.withdrawalResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    ownerType: zod_1.z.string(),
    ownerId: zod_1.z.string(),
    amount: zod_1.z.string(),
    currency: zod_1.z.string(),
    method: zod_1.z.string(),
    status: zod_1.z.string(),
    reference: zod_1.z.string().nullable(),
    createdAt: zod_1.z.date(),
});
//# sourceMappingURL=agent.js.map