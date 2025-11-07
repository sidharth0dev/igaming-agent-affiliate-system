"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2_1 = __importDefault(require("argon2"));
const commission_1 = require("../src/services/commission");
const prisma = new client_1.PrismaClient();
const commissionService = new commission_1.CommissionService(prisma);
async function hashPassword(password) {
    return argon2_1.default.hash(password, {
        type: argon2_1.default.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
    });
}
async function main() {
    console.log('🌱 Seeding database...');
    await prisma.auditLog.deleteMany();
    await prisma.kyc.deleteMany();
    await prisma.withdrawal.deleteMany();
    await prisma.commissionLedger.deleteMany();
    await prisma.commissionRule.deleteMany();
    await prisma.trackingEvent.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.player.deleteMany();
    await prisma.affiliate.deleteMany();
    await prisma.agent.deleteMany();
    await prisma.user.deleteMany();
    const adminPassword = await hashPassword('admin123');
    const admin = await prisma.user.create({
        data: {
            email: 'admin@playgrid.dev',
            passwordHash: adminPassword,
            role: 'admin',
            status: 'active',
        },
    });
    console.log('✅ Created admin:', admin.email);
    const agent1Password = await hashPassword('agent123');
    const agent1User = await prisma.user.create({
        data: {
            email: 'agent1@playgrid.dev',
            passwordHash: agent1Password,
            role: 'agent',
            status: 'active',
            name: 'Agent One',
        },
    });
    const agent1 = await prisma.agent.create({
        data: {
            userId: agent1User.id,
            code: 'AGT001',
            name: 'Agent One',
            contact: 'agent1@example.com',
            kycStatus: 'approved',
            walletBalance: 5000,
            withdrawableBalance: 3000,
        },
    });
    console.log('✅ Created agent1:', agent1.code);
    const agent2Password = await hashPassword('agent123');
    const agent2User = await prisma.user.create({
        data: {
            email: 'agent2@playgrid.dev',
            passwordHash: agent2Password,
            role: 'agent',
            status: 'active',
            name: 'Agent Two',
        },
    });
    const agent2 = await prisma.agent.create({
        data: {
            userId: agent2User.id,
            code: 'AGT002',
            name: 'Agent Two',
            contact: 'agent2@example.com',
            kycStatus: 'approved',
            walletBalance: 3000,
            withdrawableBalance: 2000,
        },
    });
    console.log('✅ Created agent2:', agent2.code);
    const aff1Password = await hashPassword('affiliate123');
    const aff1User = await prisma.user.create({
        data: {
            email: 'affiliate1@playgrid.dev',
            passwordHash: aff1Password,
            role: 'affiliate',
            status: 'active',
            name: 'Affiliate One',
        },
    });
    const affiliate1 = await prisma.affiliate.create({
        data: {
            userId: aff1User.id,
            code: 'AFF001',
            name: 'Affiliate One',
            contact: 'aff1@example.com',
            kycStatus: 'approved',
            walletBalance: 2000,
            withdrawableBalance: 1500,
            trafficSources: ['Google', 'Facebook'],
        },
    });
    console.log('✅ Created affiliate1:', affiliate1.code);
    const aff2Password = await hashPassword('affiliate123');
    const aff2User = await prisma.user.create({
        data: {
            email: 'affiliate2@playgrid.dev',
            passwordHash: aff2Password,
            role: 'affiliate',
            status: 'active',
            name: 'Affiliate Two',
        },
    });
    const affiliate2 = await prisma.affiliate.create({
        data: {
            userId: aff2User.id,
            code: 'AFF002',
            name: 'Affiliate Two',
            contact: 'aff2@example.com',
            kycStatus: 'pending',
            walletBalance: 1000,
            withdrawableBalance: 800,
            trafficSources: ['Bing', 'Twitter'],
        },
    });
    console.log('✅ Created affiliate2:', affiliate2.code);
    const players = [];
    for (let i = 1; i <= 20; i++) {
        const agentId = i <= 10 ? agent1.id : agent2.id;
        const player = await prisma.player.create({
            data: {
                username: `player${i}`,
                agentId,
                status: i % 3 === 0 ? 'blocked' : 'active',
                country: ['US', 'UK', 'CA', 'AU', 'DE'][i % 5],
                kycStatus: i % 2 === 0 ? 'approved' : 'pending',
                totalDeposits: i * 100,
                totalLosses: i * 80,
            },
        });
        players.push(player);
    }
    console.log(`✅ Created ${players.length} players`);
    const campaigns = [];
    for (let i = 1; i <= 10; i++) {
        const isAgent = i <= 5;
        const ownerType = isAgent ? 'agent' : 'affiliate';
        const ownerId = isAgent
            ? i <= 3
                ? agent1.id
                : agent2.id
            : i <= 8
                ? affiliate1.id
                : affiliate2.id;
        const campaign = await prisma.campaign.create({
            data: {
                name: `${ownerType} Campaign ${i}`,
                code: `${ownerType.toUpperCase()}${i}`,
                ownerType,
                ownerId,
                landingUrl: `https://app.playgrid.dev/register?ref=${ownerType.toUpperCase()}${i}`,
                geoAllowed: ['US', 'UK', 'CA'],
                deviceAllowed: ['desktop', 'mobile'],
                status: i % 4 === 0 ? 'inactive' : 'active',
                startAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
        });
        campaigns.push(campaign);
    }
    console.log(`✅ Created ${campaigns.length} campaigns`);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const affiliateCampaigns = campaigns.filter((c) => c.ownerType === 'affiliate');
    const agentCampaigns = campaigns.filter((c) => c.ownerType === 'agent');
    let clickCount = 0;
    let regCount = 0;
    let depositCount = 0;
    for (let day = 0; day < 30; day++) {
        const date = new Date(thirtyDaysAgo.getTime() + day * 24 * 60 * 60 * 1000);
        for (let i = 0; i < 50 + Math.floor(Math.random() * 50); i++) {
            const campaign = affiliateCampaigns[Math.floor(Math.random() * affiliateCampaigns.length)];
            if (campaign && campaign.status === 'active') {
                await prisma.trackingEvent.create({
                    data: {
                        type: 'click',
                        campaignId: campaign.id,
                        ownerType: campaign.ownerType,
                        ownerId: campaign.ownerId,
                        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
                        ua: 'Mozilla/5.0',
                        createdAt: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000),
                    },
                });
                clickCount++;
            }
        }
        const regsToday = Math.floor(clickCount * 0.15);
        for (let i = 0; i < regsToday && i < 10; i++) {
            const campaign = affiliateCampaigns[Math.floor(Math.random() * affiliateCampaigns.length)];
            if (campaign && campaign.status === 'active') {
                const player = players[Math.floor(Math.random() * players.length)];
                await prisma.trackingEvent.create({
                    data: {
                        type: 'registration',
                        playerId: player.id,
                        campaignId: campaign.id,
                        ownerType: campaign.ownerType,
                        ownerId: campaign.ownerId,
                        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
                        ua: 'Mozilla/5.0',
                        createdAt: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000),
                    },
                });
                regCount++;
            }
        }
        const depositsToday = Math.floor(regCount * 0.4);
        for (let i = 0; i < depositsToday && i < 5; i++) {
            const campaign = affiliateCampaigns[Math.floor(Math.random() * affiliateCampaigns.length)];
            if (campaign && campaign.status === 'active') {
                const player = players[Math.floor(Math.random() * players.length)];
                const amount = 50 + Math.floor(Math.random() * 500);
                const isFTD = Math.random() > 0.7;
                await prisma.trackingEvent.create({
                    data: {
                        type: 'deposit',
                        playerId: player.id,
                        campaignId: campaign.id,
                        ownerType: campaign.ownerType,
                        ownerId: campaign.ownerId,
                        amount,
                        currency: 'USD',
                        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
                        ua: 'Mozilla/5.0',
                        createdAt: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000),
                    },
                });
                if (isFTD) {
                    await prisma.trackingEvent.create({
                        data: {
                            type: 'ftd',
                            playerId: player.id,
                            campaignId: campaign.id,
                            ownerType: campaign.ownerType,
                            ownerId: campaign.ownerId,
                            amount,
                            currency: 'USD',
                            ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
                            ua: 'Mozilla/5.0',
                            createdAt: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000),
                        },
                    });
                }
                depositCount++;
            }
        }
        for (const player of players.slice(0, 10)) {
            if (player.agentId) {
                const lossAmount = 10 + Math.floor(Math.random() * 100);
                await prisma.trackingEvent.create({
                    data: {
                        type: 'loss',
                        playerId: player.id,
                        ownerType: 'agent',
                        ownerId: player.agentId,
                        amount: lossAmount,
                        currency: 'USD',
                        createdAt: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000),
                    },
                });
                await commissionService.processAgentCommissionFromLosses(player.agentId, player.id, lossAmount, date);
            }
        }
    }
    console.log(`✅ Generated ${clickCount} clicks, ${regCount} registrations, ${depositCount} deposits`);
    const ftds = await prisma.trackingEvent.findMany({
        where: { type: 'ftd', ownerType: 'affiliate' },
    });
    for (const ftd of ftds) {
        if (ftd.ownerId && ftd.amount) {
            await commissionService.processAffiliateCommission(ftd.ownerId, 'ftd', Number(ftd.amount), ftd.createdAt);
        }
    }
    const deposits = await prisma.trackingEvent.findMany({
        where: { type: 'deposit', ownerType: 'affiliate' },
    });
    for (const deposit of deposits) {
        if (deposit.ownerId && deposit.amount) {
            await commissionService.processAffiliateCommission(deposit.ownerId, 'deposit', Number(deposit.amount), deposit.createdAt);
        }
    }
    console.log('✅ Processed affiliate commissions');
    const withdrawal1 = await prisma.withdrawal.create({
        data: {
            ownerType: 'agent',
            ownerId: agent1.id,
            amount: 500,
            method: 'bank_transfer',
            currency: 'USD',
            status: 'pending',
        },
    });
    const withdrawal2 = await prisma.withdrawal.create({
        data: {
            ownerType: 'agent',
            ownerId: agent1.id,
            amount: 1000,
            method: 'bank_transfer',
            currency: 'USD',
            status: 'approved',
        },
    });
    const withdrawal3 = await prisma.withdrawal.create({
        data: {
            ownerType: 'affiliate',
            ownerId: affiliate1.id,
            amount: 300,
            method: 'paypal',
            currency: 'USD',
            status: 'paid',
            reference: 'PAY123456',
        },
    });
    console.log('✅ Created withdrawals');
    await prisma.kyc.create({
        data: {
            ownerType: 'agent',
            ownerId: agent1.id,
            docsJson: { passport: 'passport.pdf', id: 'id.pdf' },
            status: 'approved',
        },
    });
    await prisma.kyc.create({
        data: {
            ownerType: 'affiliate',
            ownerId: affiliate2.id,
            docsJson: { passport: 'passport.pdf' },
            status: 'pending',
        },
    });
    console.log('✅ Created KYC entries');
    console.log('\n🎉 Seeding completed!');
    console.log('\n📝 Login credentials:');
    console.log('Admin: admin@playgrid.dev / admin123');
    console.log('Agent 1: agent1@playgrid.dev / agent123');
    console.log('Agent 2: agent2@playgrid.dev / agent123');
    console.log('Affiliate 1: affiliate1@playgrid.dev / affiliate123');
    console.log('Affiliate 2: affiliate2@playgrid.dev / affiliate123');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map