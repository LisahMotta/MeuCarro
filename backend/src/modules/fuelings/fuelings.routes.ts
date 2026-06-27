import { Router } from 'express';
import { FuelingsController } from './fuelings.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';

const router = Router({ mergeParams: true });
const controller = new FuelingsController();

router.use(authenticate);

router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.post('/', (req, res, next) => controller.create(req, res, next));
router.get('/stats', (req, res, next) => controller.getStats(req, res, next));
router.get('/stats/monthly', (req, res, next) => controller.getMonthlyStats(req, res, next));
router.get('/:id', (req, res, next) => controller.getById(req, res, next));
router.patch('/:id', (req, res, next) => controller.update(req, res, next));
router.delete('/:id', (req, res, next) => controller.delete(req, res, next));

export { router as fuelingsRoutes };
