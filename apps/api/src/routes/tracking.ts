import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { trackRegisterSchema, trackDepositSchema } from '@igaming/types';
import { commissionService } from '../services/commission';
import { ApiError } from '../middleware/errorHandler';

const router: Router = Router();

/**
 * @swagger
 * /t/click/:campaignCode:
 *   get:
 *     summary: Track click (public)
 *     tags: [Tracking]
 */
router.get('/click/:campaignCode', async (req, res: Response, next) => {
  try {
    const { campaignCode } = req.params;
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const ua = req.headers['user-agent'] || 'unknown';

    const campaign = await prisma.campaign.findUnique({
      where: { code: campaignCode },
    });

    if (!campaign || campaign.status !== 'active') {
      const error: ApiError = new Error('Campaign not found or inactive');
      error.statusCode = 404;
      error.code = 'CAMPAIGN_NOT_FOUND';
      return next(error);
    }

    await prisma.trackingEvent.create({
      data: {
        type: 'click',
        campaignId: campaign.id,
        ownerType: campaign.ownerType,
        ownerId: campaign.ownerId,
        ip: String(ip),
        ua,
      },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /t/register:
 *   post:
 *     summary: Track registration (public)
 *     tags: [Tracking]
 */
router.post('/register', async (req, res: Response, next) => {
  try {
    const data = trackRegisterSchema.parse(req.body);
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const ua = req.headers['user-agent'] || 'unknown';

    const campaign = await prisma.campaign.findUnique({
      where: { code: data.campaignCode },
    });

    if (!campaign || campaign.status !== 'active') {
      const error: ApiError = new Error('Campaign not found or inactive');
      error.statusCode = 404;
      error.code = 'CAMPAIGN_NOT_FOUND';
      return next(error);
    }

    // Check if player already exists
    const existingPlayer = await prisma.player.findUnique({
      where: { username: data.username },
    });

    if (existingPlayer) {
      const error: ApiError = new Error('Username already exists');
      error.statusCode = 409;
      error.code = 'USERNAME_EXISTS';
      return next(error);
    }

    // Create player (if agent campaign, assign to agent)
    const player = await prisma.player.create({
      data: {
        username: data.username,
        agentId: campaign.ownerType === 'agent' ? campaign.ownerId : null,
        status: 'active',
      },
    });

    // Track registration event
    await prisma.trackingEvent.create({
      data: {
        type: 'registration',
        playerId: player.id,
        campaignId: campaign.id,
        ownerType: campaign.ownerType,
        ownerId: campaign.ownerId,
        ip: String(ip),
        ua,
      },
    });

    res.status(201).json({
      success: true,
      data: { playerId: player.id },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /t/deposit:
 *   post:
 *     summary: Track deposit (public)
 *     tags: [Tracking]
 */
router.post('/deposit', async (req, res: Response, next) => {
  try {
    const data = trackDepositSchema.parse(req.body);
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const ua = req.headers['user-agent'] || 'unknown';

    const campaign = await prisma.campaign.findUnique({
      where: { code: data.campaignCode },
    });

    if (!campaign || campaign.status !== 'active') {
      const error: ApiError = new Error('Campaign not found or inactive');
      error.statusCode = 404;
      error.code = 'CAMPAIGN_NOT_FOUND';
      return next(error);
    }

    let playerId = data.playerId;

    // If no playerId, try to find by campaign
    if (!playerId) {
      const recentReg = await prisma.trackingEvent.findFirst({
        where: {
          campaignId: campaign.id,
          type: 'registration',
        },
        orderBy: { createdAt: 'desc' },
      });
      playerId = recentReg?.playerId || undefined;
    }

    // Check if this is FTD (first time deposit)
    const isFTD = playerId
      ? !(await prisma.trackingEvent.findFirst({
          where: {
            playerId,
            type: 'ftd',
          },
        }))
      : true;

    // Update player deposits if playerId exists
    if (playerId) {
      await prisma.player.update({
        where: { id: playerId },
        data: {
          totalDeposits: {
            increment: data.amount,
          },
        },
      });
    }

    // Track deposit event
    await prisma.trackingEvent.create({
      data: {
        type: 'deposit',
        playerId: playerId || null,
        campaignId: campaign.id,
        ownerType: campaign.ownerType,
        ownerId: campaign.ownerId,
        amount: data.amount,
        currency: data.currency,
        ip: String(ip),
        ua,
      },
    });

    // Track FTD if first time
    if (isFTD && playerId) {
      await prisma.trackingEvent.create({
        data: {
          type: 'ftd',
          playerId,
          campaignId: campaign.id,
          ownerType: campaign.ownerType,
          ownerId: campaign.ownerId,
          amount: data.amount,
          currency: data.currency,
          ip: String(ip),
          ua,
        },
      });

      // Process affiliate commission for FTD (if affiliate campaign)
      if (campaign.ownerType === 'affiliate') {
        await commissionService.processAffiliateCommission(
          campaign.ownerId,
          'ftd',
          data.amount
        );
      }
    }

    // Process affiliate commission for deposit (if affiliate campaign and REVSHARE model)
    if (campaign.ownerType === 'affiliate') {
      await commissionService.processAffiliateCommission(
        campaign.ownerId,
        'deposit',
        data.amount
      );
    }

    res.status(201).json({
      success: true,
      data: { isFTD },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

