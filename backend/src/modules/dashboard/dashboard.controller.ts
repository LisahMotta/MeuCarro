import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../shared/types';
import { DashboardService } from './dashboard.service';
import { success, notFound } from '../../shared/utils/response';

const service = new DashboardService();

export class DashboardController {
  async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.getDashboard(req.params.vehicleId, req.user!.id);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }

  async getMonthlyExpenses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const data = await service.getMonthlyExpenses(req.params.vehicleId, req.user!.id, year);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'Vehicle not found') return notFound(res, 'Vehicle not found');
      next(err);
    }
  }
}
