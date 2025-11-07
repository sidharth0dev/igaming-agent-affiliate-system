import { PrismaClient, OwnerType } from '@prisma/client';
import { logger } from '../config/logger';
import { ApiError } from '../middleware/errorHandler';
import { prisma } from '../config/database';

export class WalletService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get wallet balance for agent or affiliate
   */
  async getBalance(ownerType: OwnerType, ownerId: string) {
    if (ownerType === 'agent') {
      const agent = await this.prisma.agent.findUnique({
        where: { id: ownerId },
        select: {
          walletBalance: true,
          withdrawableBalance: true,
        },
      });

      if (!agent) {
        throw new Error('Agent not found');
      }

      return {
        walletBalance: Number(agent.walletBalance),
        withdrawableBalance: Number(agent.withdrawableBalance),
      };
    } else if (ownerType === 'affiliate') {
      const affiliate = await this.prisma.affiliate.findUnique({
        where: { id: ownerId },
        select: {
          walletBalance: true,
          withdrawableBalance: true,
        },
      });

      if (!affiliate) {
        throw new Error('Affiliate not found');
      }

      return {
        walletBalance: Number(affiliate.walletBalance),
        withdrawableBalance: Number(affiliate.withdrawableBalance),
      };
    }

    throw new Error('Invalid owner type');
  }

  /**
   * Create withdrawal request (atomic balance check)
   */
  async createWithdrawal(
    ownerType: OwnerType,
    ownerId: string,
    amount: number,
    method: string,
    currency: string = 'USD'
  ) {
    // Atomic transaction to check balance and create withdrawal
    return await this.prisma.$transaction(async (tx) => {
      // Get current balance
      let currentBalance: number;
      if (ownerType === 'agent') {
        const agent = await tx.agent.findUnique({
          where: { id: ownerId },
          select: { withdrawableBalance: true },
        });

        if (!agent) {
          const error: ApiError = new Error('Agent not found');
          error.statusCode = 404;
          error.code = 'AGENT_NOT_FOUND';
          throw error;
        }

        currentBalance = Number(agent.withdrawableBalance);
      } else {
        const affiliate = await tx.affiliate.findUnique({
          where: { id: ownerId },
          select: { withdrawableBalance: true },
        });

        if (!affiliate) {
          const error: ApiError = new Error('Affiliate not found');
          error.statusCode = 404;
          error.code = 'AFFILIATE_NOT_FOUND';
          throw error;
        }

        currentBalance = Number(affiliate.withdrawableBalance);
      }

      // Check sufficient balance
      if (currentBalance < amount) {
        const error: ApiError = new Error('Insufficient balance');
        error.statusCode = 400;
        error.code = 'INSUFFICIENT_BALANCE';
        throw error;
      }

      // Create withdrawal
      const withdrawal = await tx.withdrawal.create({
        data: {
          ownerType,
          ownerId,
          amount,
          method,
          currency,
          status: 'pending',
        },
      });

      // Lock the amount (reduce withdrawable balance)
      if (ownerType === 'agent') {
        await tx.agent.update({
          where: { id: ownerId },
          data: {
            withdrawableBalance: {
              decrement: amount,
            },
          },
        });
      } else {
        await tx.affiliate.update({
          where: { id: ownerId },
          data: {
            withdrawableBalance: {
              decrement: amount,
            },
          },
        });
      }

      logger.info(
        { ownerType, ownerId, amount, withdrawalId: withdrawal.id },
        'Withdrawal created'
      );

      return withdrawal;
    });
  }

  /**
   * Update withdrawal status (admin only)
   */
  async updateWithdrawalStatus(
    withdrawalId: string,
    status: 'approved' | 'rejected' | 'paid',
    reference?: string
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const withdrawal = await tx.withdrawal.findUnique({
        where: { id: withdrawalId },
      });

      if (!withdrawal) {
        const error: ApiError = new Error('Withdrawal not found');
        error.statusCode = 404;
        error.code = 'WITHDRAWAL_NOT_FOUND';
        throw error;
      }

      // If rejecting, return the amount to withdrawable balance
      if (status === 'rejected' && withdrawal.status === 'pending') {
        if (withdrawal.ownerType === 'agent') {
          await tx.agent.update({
            where: { id: withdrawal.ownerId },
            data: {
              withdrawableBalance: {
                increment: withdrawal.amount,
              },
            },
          });
        } else {
          await tx.affiliate.update({
            where: { id: withdrawal.ownerId },
            data: {
              withdrawableBalance: {
                increment: withdrawal.amount,
              },
            },
          });
        }
      }

      // If paying, reduce wallet balance
      if (status === 'paid' && withdrawal.status !== 'paid') {
        if (withdrawal.ownerType === 'agent') {
          await tx.agent.update({
            where: { id: withdrawal.ownerId },
            data: {
              walletBalance: {
                decrement: withdrawal.amount,
              },
            },
          });
        } else {
          await tx.affiliate.update({
            where: { id: withdrawal.ownerId },
            data: {
              walletBalance: {
                decrement: withdrawal.amount,
              },
            },
          });
        }
      }

      return await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status,
          reference,
        },
      });
    });
  }
}

export const walletService = new WalletService(prisma);

