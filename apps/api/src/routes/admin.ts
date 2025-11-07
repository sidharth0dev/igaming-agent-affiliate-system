import { Router, Response } from 'express';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { updateWithdrawalSchema, withdrawalsQuerySchema } from '@igaming/types';
import { walletService } from '../services/wallet';
import { ApiError } from '../middleware/errorHandler';

const router: Router = Router();

router.use(authenticate);
router.use(requireRole('admin'));

/**
 * @swagger
 * /admin/withdrawals/:id:
 *   patch:
 *     summary: Update withdrawal status (admin only)
 *     tags: [Admin]
 */
router.patch('/withdrawals/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const data = updateWithdrawalSchema.parse(req.body);

    const withdrawal = await walletService.updateWithdrawalStatus(
      req.params.id,
      data.status,
      data.reference
    );

    res.json({
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
 * /admin/audit:
 *   get:
 *     summary: Get audit logs
 *     tags: [Admin]
 */
router.get('/audit', async (req: AuthRequest, res: Response, next) => {
  try {
    const entity = req.query.entity as string | undefined;
    const entityId = req.query.entityId as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (entity) where.entity = entity;
    if (entityId) where.entityId = entityId;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

