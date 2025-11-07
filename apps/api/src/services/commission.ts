import { PrismaClient, OwnerType, Period } from '@prisma/client';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { prisma } from '../config/database';

export class CommissionService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Calculate agent commission from net losses
   */
  async calculateAgentCommission(
    agentId: string,
    netLosses: number,
    period: Period,
    periodKey: string
  ): Promise<number> {
    const agentRevShare = env.AGENT_REVSHARE_PCT;
    const commission = netLosses * agentRevShare;

    logger.info(
      { agentId, netLosses, commission, period, periodKey },
      'Calculated agent commission'
    );

    return commission;
  }

  /**
   * Calculate affiliate commission (CPA or RevShare)
   */
  async calculateAffiliateCommission(
    affiliateId: string,
    eventType: 'ftd' | 'deposit',
    amount: number,
    period: Period,
    periodKey: string
  ): Promise<number> {
    const model = env.AFFILIATE_MODEL;

    if (model === 'CPA' && eventType === 'ftd') {
      return env.AFFILIATE_CPA_FTD;
    } else if (model === 'REVSHARE' && eventType === 'deposit') {
      return amount * env.AFFILIATE_REVSHARE_PCT;
    }

    return 0;
  }

  /**
   * Close commission period and write to ledger
   */
  async closePeriod(
    ownerType: OwnerType,
    ownerId: string,
    period: Period,
    periodKey: string,
    gross: number,
    adjustments: number = 0
  ): Promise<void> {
    const commission = gross + adjustments;

    // Use transaction to ensure atomicity
    await this.prisma.$transaction(async (tx) => {
      // Upsert ledger entry (idempotent)
      await tx.commissionLedger.upsert({
        where: {
          ownerType_ownerId_period_periodKey: {
            ownerType,
            ownerId,
            period,
            periodKey,
          },
        },
        create: {
          ownerType,
          ownerId,
          period,
          periodKey,
          gross: gross,
          adjustments: adjustments,
          commission: commission,
          currency: 'USD',
        },
        update: {
          gross: gross,
          adjustments: adjustments,
          commission: commission,
        },
      });

      // Update withdrawable balance
      if (ownerType === 'agent') {
        await tx.agent.update({
          where: { id: ownerId },
          data: {
            withdrawableBalance: {
              increment: commission,
            },
            walletBalance: {
              increment: commission,
            },
          },
        });
      } else if (ownerType === 'affiliate') {
        await tx.affiliate.update({
          where: { id: ownerId },
          data: {
            withdrawableBalance: {
              increment: commission,
            },
            walletBalance: {
              increment: commission,
            },
          },
        });
      }
    });

    logger.info(
      { ownerType, ownerId, period, periodKey, gross, adjustments, commission },
      'Closed commission period'
    );
  }

  /**
   * Get period key for a date
   */
  getPeriodKey(date: Date, period: Period): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const week = this.getWeekNumber(date);

    switch (period) {
      case 'daily':
        return `${year}-${month}-${day}`;
      case 'weekly':
        return `${year}-W${week}`;
      case 'monthly':
        return `${year}-${month}`;
      default:
        return `${year}-${month}-${day}`;
    }
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  /**
   * Process agent commission from player losses
   */
  async processAgentCommissionFromLosses(
    agentId: string,
    playerId: string,
    lossAmount: number,
    date: Date = new Date()
  ): Promise<void> {
    const period: Period = 'daily';
    const periodKey = this.getPeriodKey(date, period);

    const commission = await this.calculateAgentCommission(
      agentId,
      lossAmount,
      period,
      periodKey
    );

    // Get existing ledger or create new
    const existing = await this.prisma.commissionLedger.findUnique({
      where: {
        ownerType_ownerId_period_periodKey: {
          ownerType: 'agent',
          ownerId: agentId,
          period,
          periodKey,
        },
      },
    });

    const newGross = existing ? Number(existing.gross) + commission : commission;

    await this.closePeriod('agent', agentId, period, periodKey, newGross, 0);
  }

  /**
   * Process affiliate commission from FTD or deposit
   */
  async processAffiliateCommission(
    affiliateId: string,
    eventType: 'ftd' | 'deposit',
    amount: number,
    date: Date = new Date()
  ): Promise<void> {
    const period: Period = 'daily';
    const periodKey = this.getPeriodKey(date, period);

    const commission = await this.calculateAffiliateCommission(
      affiliateId,
      eventType,
      amount,
      period,
      periodKey
    );

    if (commission <= 0) {
      return;
    }

    // Get existing ledger or create new
    const existing = await this.prisma.commissionLedger.findUnique({
      where: {
        ownerType_ownerId_period_periodKey: {
          ownerType: 'affiliate',
          ownerId: affiliateId,
          period,
          periodKey,
        },
      },
    });

    const newGross = existing ? Number(existing.gross) + commission : commission;

    await this.closePeriod('affiliate', affiliateId, period, periodKey, newGross, 0);
  }
}

export const commissionService = new CommissionService(prisma);

