import { Router, Response } from 'express';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import {
  createPlayerSchema,
  updatePlayerSchema,
  playersQuerySchema,
  createWithdrawalSchema,
  withdrawalsQuerySchema,
  changePasswordSchema,
} from '@igaming/types';
import { hashPassword, verifyPassword } from '../utils/password';
import { walletService } from '../services/wallet';
import { commissionService } from '../services/commission';
import { ApiError } from '../middleware/errorHandler';

const router: Router = Router();

// All routes require authentication and agent role
router.use(authenticate);
router.use(requireRole('agent'));

/**
 * @swagger
 * /agent/dashboard:
 *   get:
 *     summary: Get agent dashboard KPIs
 *     tags: [Agent]
 */
router.get('/dashboard', async (req: AuthRequest, res: Response, next) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { userId: req.user!.id },
    });

    if (!agent) {
      const error: ApiError = new Error('Agent not found');
      error.statusCode = 404;
      error.code = 'AGENT_NOT_FOUND';
      return next(error);
    }

    const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = req.query.to ? new Date(req.query.to as string) : new Date();

    // Total users
    const totalUsers = await prisma.player.count({
      where: { agentId: agent.id },
    });

    // Total revenue (commission from ledger)
    const totalRevenue = await prisma.commissionLedger.aggregate({
      where: {
        ownerType: 'agent',
        ownerId: agent.id,
        createdAt: { gte: from, lte: to },
      },
      _sum: { commission: true },
    });

    // 7-day earnings
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const earnings7Days = await prisma.commissionLedger.findMany({
      where: {
        ownerType: 'agent',
        ownerId: agent.id,
        createdAt: { gte: sevenDaysAgo },
        period: 'daily',
      },
      orderBy: { periodKey: 'asc' },
    });

    const earnings7DaysFormatted = earnings7Days.map((e) => ({
      date: e.periodKey,
      amount: e.commission.toString(),
    }));

    res.json({
      success: true,
      data: {
        totalUsers,
        totalRevenue: totalRevenue._sum.commission?.toString() || '0',
        pendingBalance: '0', // Can be calculated from pending withdrawals
        withdrawableBalance: agent.withdrawableBalance.toString(),
        earnings7Days: earnings7DaysFormatted,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /agent/users:
 *   get:
 *     summary: Get agent's players (paginated)
 *     tags: [Agent]
 */
router.get('/users', async (req: AuthRequest, res: Response, next) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { userId: req.user!.id },
    });

    if (!agent) {
      const error: ApiError = new Error('Agent not found');
      error.statusCode = 404;
      error.code = 'AGENT_NOT_FOUND';
      return next(error);
    }

    const query = playersQuerySchema.parse(req.query);
    const skip = (query.page - 1) * query.limit;

    const where: any = { agentId: agent.id };
    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where.OR = [
        { username: { contains: query.search, mode: 'insensitive' } },
        { country: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.player.count({ where }),
    ]);

    res.json({
      success: true,
      data: players.map((p) => ({
        id: p.id,
        username: p.username,
        agentId: p.agentId,
        status: p.status,
        country: p.country,
        kycStatus: p.kycStatus,
        totalDeposits: p.totalDeposits.toString(),
        totalLosses: p.totalLosses.toString(),
        createdAt: p.createdAt,
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
 * /agent/users:
 *   post:
 *     summary: Create a new player
 *     tags: [Agent]
 */
router.post('/users', async (req: AuthRequest, res: Response, next) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { userId: req.user!.id },
    });

    if (!agent) {
      const error: ApiError = new Error('Agent not found');
      error.statusCode = 404;
      error.code = 'AGENT_NOT_FOUND';
      return next(error);
    }

    const data = createPlayerSchema.parse(req.body);

    const existingPlayer = await prisma.player.findUnique({
      where: { username: data.username },
    });

    if (existingPlayer) {
      const error: ApiError = new Error('Username already exists');
      error.statusCode = 409;
      error.code = 'USERNAME_EXISTS';
      return next(error);
    }

    const player = await prisma.player.create({
      data: {
        username: data.username,
        agentId: agent.id,
        country: data.country,
        status: 'active',
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: player.id,
        username: player.username,
        agentId: player.agentId,
        status: player.status,
        country: player.country,
        kycStatus: player.kycStatus,
        totalDeposits: player.totalDeposits.toString(),
        totalLosses: player.totalLosses.toString(),
        createdAt: player.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /agent/users/:id:
 *   get:
 *     summary: Get player by ID
 *     tags: [Agent]
 */
router.get('/users/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { userId: req.user!.id },
    });

    if (!agent) {
      const error: ApiError = new Error('Agent not found');
      error.statusCode = 404;
      error.code = 'AGENT_NOT_FOUND';
      return next(error);
    }

    const player = await prisma.player.findUnique({
      where: { id: req.params.id, agentId: agent.id },
    });

    if (!player) {
      const error: ApiError = new Error('Player not found');
      error.statusCode = 404;
      error.code = 'PLAYER_NOT_FOUND';
      return next(error);
    }

    res.json({
      success: true,
      data: {
        id: player.id,
        username: player.username,
        agentId: player.agentId,
        status: player.status,
        country: player.country,
        kycStatus: player.kycStatus,
        totalDeposits: player.totalDeposits.toString(),
        totalLosses: player.totalLosses.toString(),
        createdAt: player.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /agent/users/:id:
 *   patch:
 *     summary: Update player
 *     tags: [Agent]
 */
router.patch('/users/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { userId: req.user!.id },
    });

    if (!agent) {
      const error: ApiError = new Error('Agent not found');
      error.statusCode = 404;
      error.code = 'AGENT_NOT_FOUND';
      return next(error);
    }

    const data = updatePlayerSchema.parse(req.body);

    const player = await prisma.player.update({
      where: { id: req.params.id, agentId: agent.id },
      data,
    });

    res.json({
      success: true,
      data: {
        id: player.id,
        username: player.username,
        agentId: player.agentId,
        status: player.status,
        country: player.country,
        kycStatus: player.kycStatus,
        totalDeposits: player.totalDeposits.toString(),
        totalLosses: player.totalLosses.toString(),
        createdAt: player.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /agent/earnings:
 *   get:
 *     summary: Get earnings with filters
 *     tags: [Agent]
 */
router.get('/earnings', async (req: AuthRequest, res: Response, next) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { userId: req.user!.id },
    });

    if (!agent) {
      const error: ApiError = new Error('Agent not found');
      error.statusCode = 404;
      error.code = 'AGENT_NOT_FOUND';
      return next(error);
    }

    const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = req.query.to ? new Date(req.query.to as string) : new Date();
    const granularity = (req.query.granularity as 'daily' | 'weekly' | 'monthly') || 'daily';

    const earnings = await prisma.commissionLedger.findMany({
      where: {
        ownerType: 'agent',
        ownerId: agent.id,
        createdAt: { gte: from, lte: to },
        period: granularity,
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
 * /agent/withdrawals:
 *   post:
 *     summary: Create withdrawal request
 *     tags: [Agent]
 */
router.post('/withdrawals', async (req: AuthRequest, res: Response, next) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { userId: req.user!.id },
    });

    if (!agent) {
      const error: ApiError = new Error('Agent not found');
      error.statusCode = 404;
      error.code = 'AGENT_NOT_FOUND';
      return next(error);
    }

    const data = createWithdrawalSchema.parse(req.body);

    const withdrawal = await walletService.createWithdrawal(
      'agent',
      agent.id,
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
 * /agent/withdrawals:
 *   get:
 *     summary: Get withdrawal history
 *     tags: [Agent]
 */
router.get('/withdrawals', async (req: AuthRequest, res: Response, next) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { userId: req.user!.id },
    });

    if (!agent) {
      const error: ApiError = new Error('Agent not found');
      error.statusCode = 404;
      error.code = 'AGENT_NOT_FOUND';
      return next(error);
    }

    const query = withdrawalsQuerySchema.parse(req.query);
    const skip = (query.page - 1) * query.limit;

    const where: any = {
      ownerType: 'agent',
      ownerId: agent.id,
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
 * /agent/settings:
 *   get:
 *     summary: Get agent settings
 *     tags: [Agent]
 */
router.get('/settings', async (req: AuthRequest, res: Response, next) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { userId: req.user!.id },
      include: { user: true },
    });

    if (!agent) {
      const error: ApiError = new Error('Agent not found');
      error.statusCode = 404;
      error.code = 'AGENT_NOT_FOUND';
      return next(error);
    }

    res.json({
      success: true,
      data: {
        code: agent.code,
        name: agent.name,
        contact: agent.contact,
        email: agent.user.email,
        kycStatus: agent.kycStatus,
        walletBalance: agent.walletBalance.toString(),
        withdrawableBalance: agent.withdrawableBalance.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /agent/settings/password:
 *   patch:
 *     summary: Change password
 *     tags: [Agent]
 */
router.patch('/settings/password', async (req: AuthRequest, res: Response, next) => {
  try {
    const data = changePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      const error: ApiError = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      return next(error);
    }

    const isValid = await verifyPassword(user.passwordHash, data.currentPassword);
    if (!isValid) {
      const error: ApiError = new Error('Invalid current password');
      error.statusCode = 400;
      error.code = 'INVALID_PASSWORD';
      return next(error);
    }

    const newPasswordHash = await hashPassword(data.newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;

