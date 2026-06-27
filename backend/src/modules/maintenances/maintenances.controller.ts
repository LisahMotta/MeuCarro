import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../shared/types';
import { MaintenancesService } from './maintenances.service';
import { createMaintenanceSchema, updateMaintenanceSchema } from './maintenances.dto';
import { success, created, noContent, notFound, error } from '../../shared/utils/response';

const service = new MaintenancesService();

export class MaintenancesController {
  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.getAll(req.params.vehicleId, req.user!.id);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.getById(req.params.id, req.params.vehicleId, req.user!.id);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'Maintenance not found') return notFound(res);
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createMaintenanceSchema.parse(req.body);
      const data = await service.create(req.params.vehicleId, req.user!.id, dto);
      return created(res, data);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = updateMaintenanceSchema.parse(req.body);
      const data = await service.update(req.params.id, req.params.vehicleId, req.user!.id, dto);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'Maintenance not found') return notFound(res);
      next(err);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id, req.params.vehicleId, req.user!.id);
      return noContent(res);
    } catch (err: any) {
      if (err.message === 'Maintenance not found') return notFound(res);
      next(err);
    }
  }

  async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.getStats(req.params.vehicleId, req.user!.id);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async addAttachment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) return error(res, 'No file uploaded');
      const type = (req.body.type as 'photo' | 'invoice' | 'other') || 'photo';
      const url = `/uploads/${req.file.filename}`;
      const attachment = await service.addAttachment(
        req.params.id, req.params.vehicleId, req.user!.id, type, url, req.file.originalname
      );
      return created(res, attachment);
    } catch (err: any) {
      if (err.message === 'Maintenance not found') return notFound(res);
      next(err);
    }
  }
}
