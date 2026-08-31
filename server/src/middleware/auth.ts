import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid JWT token:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
