import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { Settings } from '../models/Settings';
export async function getSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await Settings.findOne({ userId: req.user?.userId }).lean();
    if (!settings) {
      const created = await Settings.create({ userId: req.user?.userId });
      res.json({ settings: created.toObject() });
      return;
    }
    res.json({ settings });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await Settings.findOneAndUpdate(
      { userId: req.user?.userId },
      { $set: req.body },
      { new: true, runValidators: true, upsert: true }
    ).lean();

    res.json({ settings });
  } catch (error) {
    next(error);
  }
}
