import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../shared/types';
import { TiresService } from './tires.service';
import { createTireSchema, updateTireSchema, createTireEventSchema } from './tires.dto';
import { success, created, noContent, notFound } from '../../shared/utils/response';

const service = new TiresService();

export class TiresController {
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
      const dto = createTireSchema.parse(req.body);
      const data = await service.create(req.params.vehicleId, req.user!.id, dto);
      return created(res, data);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = updateTireSchema.parse(req.body);
      const data = await service.update(req.params.id, req.params.vehicleId, req.user!.id, dto);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'Tire not found') return notFound(res);
      next(err);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id, req.params.vehicleId, req.user!.id);
      return noContent(res);
    } catch (err: any) {
      if (err.message === 'Tire not found') return notFound(res);
      next(err);
    }
  }

  async getEvents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.getEvents(req.params.vehicleId, req.user!.id);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async createEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createTireEventSchema.parse(req.body);
      const data = await service.createEvent(req.params.vehicleId, req.user!.id, dto);
      return created(res, data);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }
}
