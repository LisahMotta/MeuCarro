import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../shared/types';
import { VehiclesService } from './vehicles.service';
import { createVehicleSchema, updateVehicleSchema } from './vehicles.dto';
import { success, created, noContent, notFound, error } from '../../shared/utils/response';

const service = new VehiclesService();

export class VehiclesController {
  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const vehicles = await service.getAll(req.user!.id);
      return success(res, vehicles);
    } catch (err) { next(err); }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const vehicle = await service.getById(req.params.id, req.user!.id);
      return success(res, vehicle);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res);
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createVehicleSchema.parse(req.body);
      const vehicle = await service.create(req.user!.id, dto);
      return created(res, vehicle);
    } catch (err) { next(err); }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = updateVehicleSchema.parse(req.body);
      const vehicle = await service.update(req.params.id, req.user!.id, dto);
      return success(res, vehicle);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res);
      next(err);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id, req.user!.id);
      return noContent(res);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res);
      next(err);
    }
  }

  async uploadPhoto(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) return error(res, 'No file uploaded');
      const photoUrl = `/uploads/${req.file.filename}`;
      const vehicle = await service.updatePhoto(req.params.id, req.user!.id, photoUrl);
      return success(res, vehicle);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res);
      next(err);
    }
  }
}
