import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Settings } from '../models/Settings';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, name } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const user = await User.create({ email, password, name });
    await Settings.create({ userId: user._id });

    const token = jwt.sign(
      { userId: String(user._id), email: user.email },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    logger.info('User registered', { email });

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign(
      { userId: String(user._id), email: user.email },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    logger.info('User logged in', { email });

    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.json({ user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
}
