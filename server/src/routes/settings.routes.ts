import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateSettingsSchema } from '../validators/settings.validator';

const router = Router();

router.use(authenticate);
router.get('/', getSettings);
router.put('/', validate(updateSettingsSchema), updateSettings);

export default router;
