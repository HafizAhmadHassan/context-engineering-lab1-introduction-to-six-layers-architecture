import { Router } from 'express';
import {
  getExperiments,
  getExperimentById,
  deleteExperiment,
  updateExperiment,
  getExperimentStats,
} from '../controllers/experiment.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateExperimentSchema } from '../validators/experiment.validator';

const router = Router();

router.use(authenticate);

router.get('/', getExperiments);
router.get('/stats', getExperimentStats);
router.get('/:id', getExperimentById);
router.delete('/:id', deleteExperiment);
router.patch('/:id', validate(updateExperimentSchema), updateExperiment);

export default router;
