"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignResponseSchema = void 0;
const zod_1 = require("zod");
exports.campaignResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    code: zod_1.z.string(),
    ownerType: zod_1.z.enum(['agent', 'affiliate']),
    ownerId: zod_1.z.string(),
    landingUrl: zod_1.z.string().nullable(),
    geoAllowed: zod_1.z.array(zod_1.z.string()),
    deviceAllowed: zod_1.z.array(zod_1.z.string()),
    status: zod_1.z.string(),
    startAt: zod_1.z.date().nullable(),
    endAt: zod_1.z.date().nullable(),
    createdAt: zod_1.z.date(),
});
//# sourceMappingURL=campaign.js.map