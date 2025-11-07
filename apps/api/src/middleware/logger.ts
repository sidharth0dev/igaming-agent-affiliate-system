import { Request, Response, NextFunction, RequestHandler } from 'express';
import pinoHttp from 'pino-http';
import { logger } from '../config/logger';

export const httpLogger: RequestHandler = pinoHttp({
  logger,
  customLogLevel: (req: Request, res: Response) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500) {
      return 'error';
    }
    return 'info';
  },
  customSuccessMessage: (req: Request, res: Response) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: (req: Request, res: Response) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
});

