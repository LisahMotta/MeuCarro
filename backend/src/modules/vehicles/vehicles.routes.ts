import { Router } from 'express';
import { VehiclesController } from './vehicles.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';

const router = Router();
const controller = new VehiclesController();

router.use(authenticate);

router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.post('/', (req, res, next) => controller.create(req, res, next));
router.get('/:id', (req, res, next) => controller.getById(req, res, next));
router.patch('/:id', (req, res, next) => controller.update(req, res, next));
router.delete('/:id', (req, res, next) => controller.delete(req, res, next));
router.post('/:id/photo', upload.single('photo'), (req, res, next) => controller.uploadPhoto(req, res, next));

export { router as vehiclesRoutes };
