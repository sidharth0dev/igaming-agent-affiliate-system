import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  AFFILIATE_MODEL: z.enum(['CPA', 'REVSHARE']).default('CPA'),
  AFFILIATE_CPA_FTD: z.coerce.number().positive().default(30),
  AFFILIATE_REVSHARE_PCT: z.coerce.number().min(0).max(1).default(0.1),
  AGENT_REVSHARE_PCT: z.coerce.number().min(0).max(1).default(0.1),
  REDIS_URL: z.string().url().optional(),
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnv();

