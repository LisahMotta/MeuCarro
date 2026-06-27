import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const controller = new AuthController();

router.post('/register', (req, res, next) => controller.register(req, res, next));
router.post('/login', (req, res, next) => controller.login(req, res, next));
router.post('/refresh', (req, res, next) => controller.refresh(req, res, next));
router.delete('/logout', (req, res) => controller.logout(req, res));
router.get('/me', authenticate, (req, res, next) => controller.getMe(req, res, next));
router.patch('/me', authenticate, (req, res, next) => controller.updateProfile(req, res, next));

export { router as authRoutes };
