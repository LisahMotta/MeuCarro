import { Router } from 'express';
import { TiresController } from './tires.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router({ mergeParams: true });
const controller = new TiresController();

router.use(authenticate);

router.get('/events', (req, res, next) => controller.getEvents(req, res, next));
router.post('/events', (req, res, next) => controller.createEvent(req, res, next));
router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.post('/', (req, res, next) => controller.create(req, res, next));
router.patch('/:id', (req, res, next) => controller.update(req, res, next));
router.delete('/:id', (req, res, next) => controller.delete(req, res, next));

export { router as tiresRoutes };
