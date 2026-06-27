import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../shared/types';
import { AlertsService } from './alerts.service';
import { success, noContent } from '../../shared/utils/response';

const service = new AlertsService();

export class AlertsController {
  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const unreadOnly = req.query.unread === 'true';
      const data = await service.getAlerts(req.user!.id, unreadOnly);
      return success(res, data);
    } catch (err) { next(err); }
  }

  async markRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.markRead(req.params.id, req.user!.id);
      return success(res, data);
    } catch (err) { next(err); }
  }

  async markAllRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await service.markAllRead(req.user!.id);
      return noContent(res);
    } catch (err) { next(err); }
  }

  async dismiss(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.dismiss(req.params.id, req.user!.id);
      return success(res, data);
    } catch (err) { next(err); }
  }

  async generate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await service.generateAlerts(req.user!.id);
      return success(res, { message: 'Alerts generated' });
    } catch (err) { next(err); }
  }
}
