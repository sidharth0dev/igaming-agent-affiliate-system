# iGaming Platform Monorepo

Production-ready monorepo implementing Agent and Affiliate panels for a gaming platform.

## Tech Stack

- **Backend**: Node.js + Express + TypeScript, Prisma (PostgreSQL), Zod, JWT
- **Frontend**: Next.js 14 (App Router) + TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Recharts
- **Database**: PostgreSQL (Neon)
- **Deployment**: Vercel (web), Render (API)

## Project Structure

```
work/
├── apps/
│   ├── api/          # Express API
│   └── web/          # Next.js frontend
├── packages/
│   ├── types/        # Shared Zod schemas + TS types
│   └── ui/           # Shared UI components
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL database (Neon recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

### Development

```bash
# Start all apps in development mode
pnpm dev

# Or start individually
pnpm --filter api dev
pnpm --filter web dev
```

### Environment Variables

#### Backend (`apps/api/.env`)

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?pgbouncer=true&sslmode=require
JWT_ACCESS_SECRET=change_me_min_32_chars
JWT_REFRESH_SECRET=change_me_too_min_32_chars
AFFILIATE_MODEL=CPA
AFFILIATE_CPA_FTD=30
AFFILIATE_REVSHARE_PCT=0.10
AGENT_REVSHARE_PCT=0.10
REDIS_URL=
PORT=3001
NODE_ENV=development
```

#### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_BASE=http://localhost:3001/api/v1
```

## Seed Credentials

After running `pnpm db:seed`, you can login with:

- **Admin**: `admin@playgrid.dev` / `admin123`
- **Agent 1**: `agent1@playgrid.dev` / `agent123`
- **Agent 2**: `agent2@playgrid.dev` / `agent123`
- **Affiliate 1**: `affiliate1@playgrid.dev` / `affiliate123`
- **Affiliate 2**: `affiliate2@playgrid.dev` / `affiliate123`

## API Documentation

Swagger/OpenAPI docs available at:
- Development: `http://localhost:3001/api/docs`
- Production: `https://api.playgrid.dev/api/docs`

## Commission Models

### Agent Commission
- **Model**: Revenue Share
- **Default**: 10% of player net losses
- **Configurable**: `AGENT_REVSHARE_PCT` env variable

### Affiliate Commission
- **Model**: CPA (Cost Per Acquisition) or Revenue Share
- **Default**: CPA = $30 per FTD, or 10% RevShare
- **Configurable**: `AFFILIATE_MODEL`, `AFFILIATE_CPA_FTD`, `AFFILIATE_REVSHARE_PCT` env variables

## Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter api test
```

## Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter api build
pnpm --filter web build
```

## Deployment

### API (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd apps/api && pnpm install && pnpm build`
4. Set start command: `cd apps/api && pnpm start`
5. Add environment variables from `.env.example`

### Web (Vercel)

1. Connect your GitHub repository to Vercel
2. Set root directory to `apps/web`
3. Add environment variables from `.env.local.example`
4. Deploy

## CI/CD

```bash
# Lint all packages
pnpm lint

# Type check all packages
pnpm type-check
```

## Features

### Agent Panel
- Dashboard with KPIs and earnings chart
- User management (create, edit, block/unblock)
- Earnings tracking with CSV export
- Withdrawal requests with atomic balance checks
- Settings (profile, password)

### Affiliate Panel
- Dashboard with conversion funnel
- Referral link generation
- Tracking (clicks, registrations, deposits)
- Earnings tracking
- Withdrawal requests
- Marketing assets

### Admin Panel
- Withdrawal approval/rejection
- Audit logs
- User management

## License

Private - All rights reserved

