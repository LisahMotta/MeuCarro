import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../shared/types';
import { ReportsService } from './reports.service';
import { success, notFound } from '../../shared/utils/response';

const service = new ReportsService();

export class ReportsController {
  async getExpenseReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const data = await service.getExpenseReport(req.params.vehicleId, req.user!.id, year);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const data = await service.getHistory(req.params.vehicleId, req.user!.id, limit, offset);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }
}
