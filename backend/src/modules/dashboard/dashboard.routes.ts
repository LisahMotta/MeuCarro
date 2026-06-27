import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router({ mergeParams: true });
const controller = new DashboardController();

router.use(authenticate);
router.get('/', (req, res, next) => controller.getDashboard(req, res, next));
router.get('/monthly-expenses', (req, res, next) => controller.getMonthlyExpenses(req, res, next));

export { router as dashboardRoutes };
