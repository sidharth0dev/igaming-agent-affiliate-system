"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencySchema = exports.statusSchema = exports.ownerTypeSchema = exports.dateRangeSchema = exports.paginationSchema = void 0;
const zod_1 = require("zod");
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
exports.dateRangeSchema = zod_1.z.object({
    from: zod_1.z.string().datetime().optional(),
    to: zod_1.z.string().datetime().optional(),
});
exports.ownerTypeSchema = zod_1.z.enum(['agent', 'affiliate']);
exports.statusSchema = zod_1.z.enum(['pending', 'approved', 'rejected', 'paid', 'active', 'inactive', 'blocked']);
exports.currencySchema = zod_1.z.enum(['USD', 'EUR', 'GBP']).default('USD');
//# sourceMappingURL=common.js.map