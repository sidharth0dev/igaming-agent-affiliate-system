"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawalsQuerySchema = exports.updateWithdrawalSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.updateWithdrawalSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'approved', 'rejected', 'paid']),
    reference: zod_1.z.string().optional(),
});
exports.withdrawalsQuerySchema = common_1.paginationSchema.extend({
    status: zod_1.z.enum(['pending', 'approved', 'rejected', 'paid']).optional(),
    ownerType: zod_1.z.enum(['agent', 'affiliate']).optional(),
});
//# sourceMappingURL=withdrawal.js.map