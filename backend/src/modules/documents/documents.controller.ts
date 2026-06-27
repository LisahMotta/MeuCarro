import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../shared/types';
import { DocumentsService } from './documents.service';
import { createDocumentSchema, updateDocumentSchema } from './documents.dto';
import { success, created, noContent, notFound, error } from '../../shared/utils/response';

const service = new DocumentsService();

export class DocumentsController {
  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.getAll(req.params.vehicleId, req.user!.id);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createDocumentSchema.parse(req.body);
      const data = await service.create(req.params.vehicleId, req.user!.id, dto);
      return created(res, data);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = updateDocumentSchema.parse(req.body);
      const data = await service.update(req.params.id, req.params.vehicleId, req.user!.id, dto);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'Document not found') return notFound(res);
      next(err);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id, req.params.vehicleId, req.user!.id);
      return noContent(res);
    } catch (err: any) {
      if (err.message === 'Document not found') return notFound(res);
      next(err);
    }
  }

  async uploadFile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) return error(res, 'No file uploaded');
      const fileUrl = `/uploads/${req.file.filename}`;
      const data = await service.uploadFile(req.params.id, req.params.vehicleId, req.user!.id, fileUrl);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'Document not found') return notFound(res);
      next(err);
    }
  }
}
