import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { httpLogger } from './middleware/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { env } from './config/env';
import { connectDatabase } from './config/database';

// Routes
import authRoutes from './routes/auth';
import agentRoutes from './routes/agent';
import affiliateRoutes from './routes/affiliate';
import trackingRoutes from './routes/tracking';
import reportsRoutes from './routes/reports';
import adminRoutes from './routes/admin';
import { setupSwagger } from './config/swagger';

const app: express.Application = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.NODE_ENV === 'production' ? 'https://app.playgrid.dev' : true,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
app.use(httpLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/v1', limiter);

// Public tracking endpoints - stricter rate limit
const trackingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
app.use('/api/v1/t', trackingLimiter);

// Health check
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/agent', agentRoutes);
app.use('/api/v1/affiliate', affiliateRoutes);
app.use('/api/v1/t', trackingRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/admin', adminRoutes);

// Swagger docs
setupSwagger(app);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection
connectDatabase();

export default app;

