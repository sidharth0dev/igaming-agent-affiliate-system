import { Router, Response } from 'express';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { prisma } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { registerSchema, loginSchema, changePasswordSchema } from '@igaming/types';
import { ApiError } from '../middleware/errorHandler';

const router: Router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (admin only)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, agent, affiliate, player]
 */
router.post('/register', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    if (req.user?.role !== 'admin') {
      const error: ApiError = new Error('Only admins can create users');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      return next(error);
    }

    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      const error: ApiError = new Error('User already exists');
      error.statusCode = 409;
      error.code = 'USER_EXISTS';
      return next(error);
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // Create agent or affiliate if needed
    if (data.role === 'agent') {
      const code = `AGT${user.id.slice(0, 8).toUpperCase()}`;
      await prisma.agent.create({
        data: {
          userId: user.id,
          code,
          name: data.name || user.email,
        },
      });
    } else if (data.role === 'affiliate') {
      const code = `AFF${user.id.slice(0, 8).toUpperCase()}`;
      await prisma.affiliate.create({
        data: {
          userId: user.id,
          code,
          name: data.name || user.email,
        },
      });
    }

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post('/login', async (req, res: Response, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        agent: true,
        affiliate: true,
      },
    });

    if (!user || !(await verifyPassword(user.passwordHash, password))) {
      const error: ApiError = new Error('Invalid credentials');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      return next(error);
    }

    if (user.status !== 'active') {
      const error: ApiError = new Error('Account is inactive');
      error.statusCode = 403;
      error.code = 'ACCOUNT_INACTIVE';
      return next(error);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
router.post('/refresh', async (req, res: Response, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      const error: ApiError = new Error('No refresh token provided');
      error.statusCode = 401;
      error.code = 'NO_REFRESH_TOKEN';
      return next(error);
    }

    const payload = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.status !== 'active') {
      const error: ApiError = new Error('User not found or inactive');
      error.statusCode = 401;
      error.code = 'INVALID_TOKEN';
      return next(error);
    }

    const newPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(newPayload);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 */
router.post('/logout', (req, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true });
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 */
router.get('/me', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        lastLoginAt: true,
        twoFAEnabled: true,
        createdAt: true,
      },
    });

    if (!user) {
      const error: ApiError = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      return next(error);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

