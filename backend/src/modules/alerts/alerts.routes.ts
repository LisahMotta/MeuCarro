import { Router } from 'express';
import { AlertsController } from './alerts.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const controller = new AlertsController();

router.use(authenticate);
router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.post('/generate', (req, res, next) => controller.generate(req, res, next));
router.patch('/read-all', (req, res, next) => controller.markAllRead(req, res, next));
router.patch('/:id/read', (req, res, next) => controller.markRead(req, res, next));
router.patch('/:id/dismiss', (req, res, next) => controller.dismiss(req, res, next));

export { router as alertsRoutes };
