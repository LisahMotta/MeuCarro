import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router({ mergeParams: true });
const controller = new ReportsController();

router.use(authenticate);
router.get('/expenses', (req, res, next) => controller.getExpenseReport(req, res, next));
router.get('/history', (req, res, next) => controller.getHistory(req, res, next));

export { router as reportsRoutes };
