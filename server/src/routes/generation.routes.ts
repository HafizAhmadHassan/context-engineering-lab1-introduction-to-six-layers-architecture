import { Router } from 'express';
import { generate } from '../controllers/generation.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { generateSchema } from '../validators/generation.validator';

const router = Router();

router.post('/', authenticate, validate(generateSchema), generate);

export default router;
