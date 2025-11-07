# Research & Learnings

## Architecture Decisions

### Monorepo Structure
- **Why pnpm workspaces**: Better performance and disk space efficiency compared to npm/yarn
- **Shared packages**: Types and UI components shared between frontend and backend for consistency
- **Path aliases**: Clean imports with `@/` and `@igaming/types`, `@igaming/ui`

### Database Design
- **PostgreSQL (Neon)**: Serverless PostgreSQL with connection pooling
- **Prisma ORM**: Type-safe database access, migrations, and schema management
- **Indexes**: Strategic indexes on `ownerType+ownerId`, `campaignId+createdAt` for performance
- **Decimal types**: `NUMERIC(18,2)` for precise financial calculations

### Authentication
- **JWT with httpOnly cookies**: Secure token storage, prevents XSS attacks
- **Access + Refresh tokens**: Short-lived access tokens (15min), longer refresh tokens (7 days)
- **Argon2**: Modern password hashing algorithm (argon2id variant)

### Commission Engine
- **Idempotency**: Unique constraints on `CommissionLedger` prevent double-counting
- **Transactional**: Wallet updates and ledger writes in transactions
- **Period-based**: Daily/weekly/monthly period closing with period keys
- **Env-configurable**: Commission rates and models via environment variables

### API Design
- **RESTful**: Standard HTTP methods and status codes
- **Zod validation**: Runtime type checking and validation
- **Swagger/OpenAPI**: Auto-generated API documentation
- **Error handling**: Structured error responses with codes
- **Rate limiting**: Public endpoints protected with stricter limits

### Frontend Architecture
- **Next.js App Router**: Modern React framework with server components
- **TanStack Query**: Server state management, caching, refetching
- **Recharts**: Responsive charts for data visualization
- **Dark theme**: 1xBet/Dafabet-style dark UI with high contrast
- **Component composition**: Reusable UI components from shared package

## Key Learnings

### Commission Calculation
- Agent commissions calculated from net losses (player losses)
- Affiliate commissions: CPA per FTD or RevShare on deposits
- Period closing writes to ledger and updates withdrawable balance atomically
- Idempotency keys prevent duplicate commission entries

### Tracking Funnel
- Click → Registration → Deposit → FTD (First Time Deposit)
- FTD detection: Check if player has previous FTD event
- Commission triggered on FTD (CPA) or deposit (RevShare)

### Wallet Management
- Two balances: `walletBalance` (total) and `withdrawableBalance` (available)
- Withdrawal requests lock amount from withdrawable balance
- On approval: amount moves from withdrawable to paid
- On rejection: amount returns to withdrawable balance

### Performance Considerations
- Database indexes on frequently queried fields
- Pagination for large datasets
- Caching with TanStack Query (60s stale time)
- Connection pooling with Neon (pgbouncer)

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TanStack Query](https://tanstack.com/query/latest)
- [Neon PostgreSQL](https://neon.tech)
- [Render Deployment](https://render.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

## Future Enhancements

- Redis caching for dashboard KPIs
- Real-time updates with WebSockets
- Advanced reporting with date range filters
- Email notifications for withdrawals
- Two-factor authentication (2FA)
- Admin panel UI
- CSV export for all reports
- Multi-currency support
- Tiered commission structures

