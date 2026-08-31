import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    logger.warn(`Operational error: ${err.message}`);
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  logger.error('Unexpected error:', err);
  res.status(500).json({
    error: 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { details: err.message }),
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Resource not found' });
}
