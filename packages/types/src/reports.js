"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topCampaignResponseSchema = exports.timeseriesResponseSchema = exports.overviewResponseSchema = exports.topCampaignsQuerySchema = exports.timeseriesQuerySchema = exports.overviewQuerySchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.overviewQuerySchema = common_1.dateRangeSchema.extend({
    ownerType: common_1.ownerTypeSchema.optional(),
    ownerId: zod_1.z.string().optional(),
});
exports.timeseriesQuerySchema = exports.overviewQuerySchema.extend({
    groupBy: zod_1.z.enum(['campaign', 'day']).default('day'),
});
exports.topCampaignsQuerySchema = exports.overviewQuerySchema.extend({
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
});
exports.overviewResponseSchema = zod_1.z.object({
    totalClicks: zod_1.z.number(),
    totalRegistrations: zod_1.z.number(),
    totalDeposits: zod_1.z.number(),
    totalRevenue: zod_1.z.string(),
    totalCommissions: zod_1.z.string(),
});
exports.timeseriesResponseSchema = zod_1.z.array(zod_1.z.object({
    period: zod_1.z.string(),
    clicks: zod_1.z.number(),
    registrations: zod_1.z.number(),
    deposits: zod_1.z.number(),
    revenue: zod_1.z.string(),
    commissions: zod_1.z.string(),
}));
exports.topCampaignResponseSchema = zod_1.z.object({
    campaignId: zod_1.z.string(),
    campaignName: zod_1.z.string(),
    clicks: zod_1.z.number(),
    registrations: zod_1.z.number(),
    deposits: zod_1.z.number(),
    revenue: zod_1.z.string(),
});
//# sourceMappingURL=reports.js.map