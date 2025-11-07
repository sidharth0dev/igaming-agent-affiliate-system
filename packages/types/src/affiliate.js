"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetResponseSchema = exports.linkResponseSchema = exports.createLinkSchema = exports.affiliateDashboardResponseSchema = void 0;
const zod_1 = require("zod");
exports.affiliateDashboardResponseSchema = zod_1.z.object({
    clicks: zod_1.z.number(),
    registrations: zod_1.z.number(),
    ftds: zod_1.z.number(),
    deposits: zod_1.z.number(),
    revenue: zod_1.z.string(),
    conversionChart: zod_1.z.array(zod_1.z.object({
        date: zod_1.z.string(),
        clicks: zod_1.z.number(),
        registrations: zod_1.z.number(),
        deposits: zod_1.z.number(),
    })),
});
exports.createLinkSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    landingUrl: zod_1.z.string().url().optional(),
});
exports.linkResponseSchema = zod_1.z.object({
    code: zod_1.z.string(),
    url: zod_1.z.string(),
    campaignId: zod_1.z.string(),
});
exports.assetResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    url: zod_1.z.string(),
    dimensions: zod_1.z.string(),
    format: zod_1.z.string(),
});
//# sourceMappingURL=affiliate.js.map