import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { Experiment } from '../models/Experiment';
import { AppError } from '../middleware/errorHandler';

export async function getExperiments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [experiments, total] = await Promise.all([
      Experiment.find({ userId: req.user?.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Experiment.countDocuments({ userId: req.user?.userId }),
    ]);

    res.json({
      experiments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}

export async function getExperimentById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const experiment = await Experiment.findOne({
      _id: req.params.id,
      userId: req.user?.userId,
    }).lean();

    if (!experiment) {
      throw new AppError('Experiment not found', 404);
    }

    res.json({ experiment });
  } catch (error) {
    next(error);
  }
}

export async function deleteExperiment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await Experiment.deleteOne({
      _id: req.params.id,
      userId: req.user?.userId,
    });

    if (result.deletedCount === 0) {
      throw new AppError('Experiment not found', 404);
    }

    res.json({ message: 'Experiment deleted' });
  } catch (error) {
    next(error);
  }
}

export async function updateExperiment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const experiment = await Experiment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!experiment) {
      throw new AppError('Experiment not found', 404);
    }

    res.json({ experiment });
  } catch (error) {
    next(error);
  }
}

export async function getExperimentStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await Experiment.aggregate([
      { $match: { userId: req.user?.userId } },
      {
        $group: {
          _id: null,
          totalExperiments: { $sum: 1 },
          avgOverallScore: { $avg: '$evaluation.overall' },
          avgLatency: { $avg: '$latencyMs' },
          avgTokens: { $avg: '$totalTokens' },
          totalCost: { $sum: '$estimatedCost' },
        },
      },
    ]);

    res.json({ stats: stats[0] || {} });
  } catch (error) {
    next(error);
  }
}
