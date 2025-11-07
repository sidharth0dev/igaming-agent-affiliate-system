"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playersQuerySchema = exports.playerResponseSchema = exports.updatePlayerSchema = exports.createPlayerSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.createPlayerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    email: zod_1.z.string().email().optional(),
    country: zod_1.z.string().optional(),
    password: zod_1.z.string().min(8).optional(),
});
exports.updatePlayerSchema = zod_1.z.object({
    status: common_1.statusSchema.optional(),
    country: zod_1.z.string().optional(),
    kycStatus: common_1.statusSchema.optional(),
});
exports.playerResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    username: zod_1.z.string(),
    agentId: zod_1.z.string().nullable(),
    status: zod_1.z.string(),
    country: zod_1.z.string().nullable(),
    kycStatus: zod_1.z.string(),
    totalDeposits: zod_1.z.string(),
    totalLosses: zod_1.z.string(),
    createdAt: zod_1.z.date(),
});
exports.playersQuerySchema = common_1.paginationSchema.extend({
    status: common_1.statusSchema.optional(),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=user.js.map