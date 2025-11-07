import { Router, Response } from 'express';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { createLinkSchema, withdrawalsQuerySchema, createWithdrawalSchema } from '@igaming/types';
import { walletService } from '../services/wallet';
import { ApiError } from '../middleware/errorHandler';

const router: Router = Router();

router.use(authenticate);
router.use(requireRole('affiliate'));

/**
 * @swagger
 * /affiliate/dashboard:
 *   get:
 *     summary: Get affiliate dashboard KPIs
 *     tags: [Affiliate]
 */
router.get('/dashboard', async (req: AuthRequest, res: Response, next) => {
  try {
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: req.user!.id },
    });

    if (!affiliate) {
      const error: ApiError = new Error('Affiliate not found');
      error.statusCode = 404;
      error.code = 'AFFILIATE_NOT_FOUND';
      return next(error);
    }

    const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = req.query.to ? new Date(req.query.to as string) : new Date();

    // Get campaigns
    const campaigns = await prisma.campaign.findMany({
      where: {
        ownerType: 'affiliate',
        ownerId: affiliate.id,
      },
      select: { id: true },
    });

    const campaignIds = campaigns.map((c) => c.id);

    // Clicks
    const clicks = await prisma.trackingEvent.count({
      where: {
        campaignId: { in: campaignIds },
        type: 'click',
        createdAt: { gte: from, lte: to },
      },
    });

    // Registrations
    const registrations = await prisma.trackingEvent.count({
      where: {
        campaignId: { in: campaignIds },
        type: 'registration',
        createdAt: { gte: from, lte: to },
      },
    });

    // FTDs
    const ftds = await prisma.trackingEvent.count({
      where: {
        campaignId: { in: campaignIds },
        type: 'ftd',
        createdAt: { gte: from, lte: to },
      },
    });

    // Deposits
    const depositsAgg = await prisma.trackingEvent.aggregate({
      where: {
        campaignId: { in: campaignIds },
        type: 'deposit',
        createdAt: { gte: from, lte: to },
      },
      _sum: { amount: true },
      _count: true,
    });

    // Revenue (commission)
    const revenueAgg = await prisma.commissionLedger.aggregate({
      where: {
        ownerType: 'affiliate',
        ownerId: affiliate.id,
        createdAt: { gte: from, lte: to },
      },
      _sum: { commission: true },
    });

    // Conversion chart (7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const conversionData = await prisma.trackingEvent.groupBy({
      by: ['createdAt'],
      where: {
        campaignId: { in: campaignIds },
        createdAt: { gte: sevenDaysAgo },
        type: { in: ['click', 'registration', 'deposit'] },
      },
    });

    // Group by date
    const conversionChart: Record<string, { clicks: number; registrations: number; deposits: number }> = {};
    for (const event of conversionData) {
      const date = event.createdAt.toISOString().split('T')[0];
      if (!conversionChart[date]) {
        conversionChart[date] = { clicks: 0, registrations: 0, deposits: 0 };
      }
    }

    // Fill in actual counts
    const clicksByDate = await prisma.trackingEvent.groupBy({
      by: ['createdAt'],
      where: {
        campaignId: { in: campaignIds },
        createdAt: { gte: sevenDaysAgo },
        type: 'click',
      },
    });

    const regsByDate = await prisma.trackingEvent.groupBy({
      by: ['createdAt'],
      where: {
        campaignId: { in: campaignIds },
        createdAt: { gte: sevenDaysAgo },
        type: 'registration',
      },
    });

    const depsByDate = await prisma.trackingEvent.groupBy({
      by: ['createdAt'],
      where: {
        campaignId: { in: campaignIds },
        createdAt: { gte: sevenDaysAgo },
        type: 'deposit',
      },
    });

    const chartData = Object.keys(conversionChart).map((date) => ({
      date,
      clicks: clicksByDate.filter((c) => c.createdAt.toISOString().split('T')[0] === date).length,
      registrations: regsByDate.filter((r) => r.createdAt.toISOString().split('T')[0] === date).length,
      deposits: depsByDate.filter((d) => d.createdAt.toISOString().split('T')[0] === date).length,
    }));

    res.json({
      success: true,
      data: {
        clicks,
        registrations,
        ftds,
        deposits: depositsAgg._count || 0,
        revenue: revenueAgg._sum.commission?.toString() || '0',
        conversionChart: chartData,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /affiliate/links:
 *   post:
 *     summary: Generate referral link
 *     tags: [Affiliate]
 */
router.post('/links', async (req: AuthRequest, res: Response, next) => {
  try {
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: req.user!.id },
    });

    if (!affiliate) {
      const error: ApiError = new Error('Affiliate not found');
      error.statusCode = 404;
      error.code = 'AFFILIATE_NOT_FOUND';
      return next(error);
    }

    const data = createLinkSchema.parse(req.body);

    // Generate unique campaign code
    const code = `AFF${affiliate.code}${Date.now().toString(36).toUpperCase()}`;

    const campaign = await prisma.campaign.create({
      data: {
        name: data.name,
        code,
        ownerType: 'affiliate',
        ownerId: affiliate.id,
        landingUrl: data.landingUrl,
        status: 'active',
        geoAllowed: [],
        deviceAllowed: [],
      },
    });

    const url = `https://app.playgrid.dev/register?ref=${code}`;

    res.status(201).json({
      success: true,
      data: {
        code: campaign.code,
        url,
        campaignId: campaign.id,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /affiliate/earnings:
 *   get:
 *     summary: Get affiliate earnings
 *     tags: [Affiliate]
 */
router.get('/earnings', async (req: AuthRequest, res: Response, next) => {
  try {
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: req.user!.id },
    });

    if (!affiliate) {
      const error: ApiError = new Error('Affiliate not found');
      error.statusCode = 404;
      error.code = 'AFFILIATE_NOT_FOUND';
      return next(error);
    }

    const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = req.query.to ? new Date(req.query.to as string) : new Date();

    const earnings = await prisma.commissionLedger.findMany({
      where: {
        ownerType: 'affiliate',
        ownerId: affiliate.id,
        createdAt: { gte: from, lte: to },
      },
      orderBy: { periodKey: 'asc' },
    });

    res.json({
      success: true,
      data: earnings.map((e) => ({
        period: e.periodKey,
        gross: e.gross.toString(),
        adjustments: e.adjustments.toString(),
        commission: e.commission.toString(),
        currency: e.currency,
        createdAt: e.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /affiliate/withdrawals:
 *   post:
 *     summary: Create withdrawal request
 *     tags: [Affiliate]
 */
router.post('/withdrawals', async (req: AuthRequest, res: Response, next) => {
  try {
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: req.user!.id },
    });

    if (!affiliate) {
      const error: ApiError = new Error('Affiliate not found');
      error.statusCode = 404;
      error.code = 'AFFILIATE_NOT_FOUND';
      return next(error);
    }

    const data = createWithdrawalSchema.parse(req.body);

    const withdrawal = await walletService.createWithdrawal(
      'affiliate',
      affiliate.id,
      data.amount,
      data.method,
      data.currency
    );

    res.status(201).json({
      success: true,
      data: {
        id: withdrawal.id,
        ownerType: withdrawal.ownerType,
        ownerId: withdrawal.ownerId,
        amount: withdrawal.amount.toString(),
        currency: withdrawal.currency,
        method: withdrawal.method,
        status: withdrawal.status,
        reference: withdrawal.reference,
        createdAt: withdrawal.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /affiliate/withdrawals:
 *   get:
 *     summary: Get withdrawal history
 *     tags: [Affiliate]
 */
router.get('/withdrawals', async (req: AuthRequest, res: Response, next) => {
  try {
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: req.user!.id },
    });

    if (!affiliate) {
      const error: ApiError = new Error('Affiliate not found');
      error.statusCode = 404;
      error.code = 'AFFILIATE_NOT_FOUND';
      return next(error);
    }

    const query = withdrawalsQuerySchema.parse(req.query);
    const skip = (query.page - 1) * query.limit;

    const where: any = {
      ownerType: 'affiliate',
      ownerId: affiliate.id,
    };
    if (query.status) {
      where.status = query.status;
    }

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.withdrawal.count({ where }),
    ]);

    res.json({
      success: true,
      data: withdrawals.map((w) => ({
        id: w.id,
        ownerType: w.ownerType,
        ownerId: w.ownerId,
        amount: w.amount.toString(),
        currency: w.currency,
        method: w.method,
        status: w.status,
        reference: w.reference,
        createdAt: w.createdAt,
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /affiliate/assets:
 *   get:
 *     summary: Get marketing assets
 *     tags: [Affiliate]
 */
router.get('/assets', async (req: AuthRequest, res: Response, next) => {
  try {
    // Static list of banners
    const assets = [
      {
        id: '1',
        name: 'Banner 728x90',
        url: 'https://app.playgrid.dev/assets/banner-728x90.png',
        dimensions: '728x90',
        format: 'PNG',
      },
      {
        id: '2',
        name: 'Banner 300x250',
        url: 'https://app.playgrid.dev/assets/banner-300x250.png',
        dimensions: '300x250',
        format: 'PNG',
      },
      {
        id: '3',
        name: 'Banner 160x600',
        url: 'https://app.playgrid.dev/assets/banner-160x600.png',
        dimensions: '160x600',
        format: 'PNG',
      },
    ];

    res.json({
      success: true,
      data: assets,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

