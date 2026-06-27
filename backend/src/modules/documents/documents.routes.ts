import { Router } from 'express';
import { DocumentsController } from './documents.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';

const router = Router({ mergeParams: true });
const controller = new DocumentsController();

router.use(authenticate);

router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.post('/', (req, res, next) => controller.create(req, res, next));
router.patch('/:id', (req, res, next) => controller.update(req, res, next));
router.delete('/:id', (req, res, next) => controller.delete(req, res, next));
router.post('/:id/file', upload.single('file'), (req, res, next) => controller.uploadFile(req, res, next));

export { router as documentsRoutes };
