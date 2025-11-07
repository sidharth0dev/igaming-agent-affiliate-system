import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { overviewQuerySchema, timeseriesQuerySchema, topCampaignsQuerySchema } from '@igaming/types';

const router: Router = Router();

router.use(authenticate);

/**
 * @swagger
 * /reports/overview:
 *   get:
 *     summary: Get overview report
 *     tags: [Reports]
 */
router.get('/overview', async (req: AuthRequest, res: Response, next) => {
  try {
    const query = overviewQuerySchema.parse(req.query);
    const from = query.from ? new Date(query.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = query.to ? new Date(query.to) : new Date();

    let where: any = {
      createdAt: { gte: from, lte: to },
    };

    if (query.ownerType && query.ownerId) {
      where.ownerType = query.ownerType;
      where.ownerId = query.ownerId;
    }

    const [clicks, registrations, deposits, revenue] = await Promise.all([
      prisma.trackingEvent.count({
        where: { ...where, type: 'click' },
      }),
      prisma.trackingEvent.count({
        where: { ...where, type: 'registration' },
      }),
      prisma.trackingEvent.aggregate({
        where: { ...where, type: 'deposit' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.commissionLedger.aggregate({
        where,
        _sum: { commission: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalClicks: clicks,
        totalRegistrations: registrations,
        totalDeposits: deposits._count || 0,
        totalRevenue: deposits._sum.amount?.toString() || '0',
        totalCommissions: revenue._sum.commission?.toString() || '0',
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /reports/timeseries:
 *   get:
 *     summary: Get timeseries report
 *     tags: [Reports]
 */
router.get('/timeseries', async (req: AuthRequest, res: Response, next) => {
  try {
    const query = timeseriesQuerySchema.parse(req.query);
    const from = query.from ? new Date(query.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = query.to ? new Date(query.to) : new Date();
    const groupBy = query.groupBy || 'day';

    let where: any = {
      createdAt: { gte: from, lte: to },
    };

    if (query.ownerType && query.ownerId) {
      where.ownerType = query.ownerType;
      where.ownerId = query.ownerId;
    }

    // Simplified implementation - group by day
    const events = await prisma.trackingEvent.findMany({
      where: {
        ...where,
        type: { in: ['click', 'registration', 'deposit'] },
      },
      select: {
        type: true,
        amount: true,
        createdAt: true,
        campaignId: true,
      },
    });

    // Group by period
    const grouped: Record<string, { clicks: number; registrations: number; deposits: number; revenue: string; commissions: string }> = {};

    for (const event of events) {
      const period = groupBy === 'campaign' ? event.campaignId || 'unknown' : event.createdAt.toISOString().split('T')[0];
      if (!grouped[period]) {
        grouped[period] = { clicks: 0, registrations: 0, deposits: 0, revenue: '0', commissions: '0' };
      }

      if (event.type === 'click') grouped[period].clicks++;
      if (event.type === 'registration') grouped[period].registrations++;
      if (event.type === 'deposit') {
        grouped[period].deposits++;
        const currentRevenue = parseFloat(grouped[period].revenue);
        grouped[period].revenue = (currentRevenue + Number(event.amount || 0)).toString();
      }
    }

    const result = Object.entries(grouped).map(([period, data]) => ({
      period,
      ...data,
    }));

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /reports/top-campaigns:
 *   get:
 *     summary: Get top campaigns report
 *     tags: [Reports]
 */
router.get('/top-campaigns', async (req: AuthRequest, res: Response, next) => {
  try {
    const query = topCampaignsQuerySchema.parse(req.query);
    const from = query.from ? new Date(query.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = query.to ? new Date(query.to) : new Date();

    let where: any = {
      createdAt: { gte: from, lte: to },
    };

    if (query.ownerType && query.ownerId) {
      where.ownerType = query.ownerType;
      where.ownerId = query.ownerId;
    }

    const campaigns = await prisma.campaign.findMany({
      where: query.ownerType && query.ownerId ? {
        ownerType: query.ownerType,
        ownerId: query.ownerId,
      } : undefined,
      select: { id: true, name: true },
    });

    const campaignStats = await Promise.all(
      campaigns.map(async (campaign) => {
        const [clicks, registrations, deposits, revenue] = await Promise.all([
          prisma.trackingEvent.count({
            where: { ...where, campaignId: campaign.id, type: 'click' },
          }),
          prisma.trackingEvent.count({
            where: { ...where, campaignId: campaign.id, type: 'registration' },
          }),
          prisma.trackingEvent.count({
            where: { ...where, campaignId: campaign.id, type: 'deposit' },
          }),
          prisma.trackingEvent.aggregate({
            where: { ...where, campaignId: campaign.id, type: 'deposit' },
            _sum: { amount: true },
          }),
        ]);

        return {
          campaignId: campaign.id,
          campaignName: campaign.name,
          clicks,
          registrations,
          deposits,
          revenue: revenue._sum.amount?.toString() || '0',
        };
      })
    );

    campaignStats.sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue));

    res.json({
      success: true,
      data: campaignStats.slice(0, query.limit),
    });
  } catch (error) {
    next(error);
  }
});

export default router;

