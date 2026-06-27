import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../shared/types';
import { FuelingsService } from './fuelings.service';
import { createFuelingSchema, updateFuelingSchema } from './fuelings.dto';
import { success, created, noContent, notFound, error } from '../../shared/utils/response';
import { getPagination } from '../../shared/utils/pagination';

const service = new FuelingsService();

export class FuelingsController {
  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { limit, offset } = getPagination(req);
      const fuelings = await service.getAll(req.params.vehicleId, req.user!.id, limit, offset);
      return success(res, fuelings);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const fueling = await service.getById(req.params.id, req.params.vehicleId, req.user!.id);
      return success(res, fueling);
    } catch (err: any) {
      if (err.message === 'Fueling not found') return notFound(res);
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createFuelingSchema.parse(req.body);
      const fueling = await service.create(req.params.vehicleId, req.user!.id, dto);
      return created(res, fueling);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = updateFuelingSchema.parse(req.body);
      const fueling = await service.update(req.params.id, req.params.vehicleId, req.user!.id, dto);
      return success(res, fueling);
    } catch (err: any) {
      if (err.message === 'Fueling not found') return notFound(res);
      next(err);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id, req.params.vehicleId, req.user!.id);
      return noContent(res);
    } catch (err: any) {
      if (err.message === 'Fueling not found') return notFound(res);
      next(err);
    }
  }

  async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const stats = await service.getStats(req.params.vehicleId, req.user!.id);
      return success(res, stats);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async getMonthlyStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const stats = await service.getMonthlyStats(req.params.vehicleId, req.user!.id, year);
      return success(res, stats);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }
}
