import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../shared/types';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema, updateProfileSchema } from './auth.dto';
import { success, created, error, unauthorized } from '../../shared/utils/response';

const service = new AuthService();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export class AuthController {
  async register(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = registerSchema.parse(req.body);
      const result = await service.register(dto);
      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
      return created(res, { user: result.user, accessToken: result.accessToken });
    } catch (err: any) {
      if (err.message === 'Email already in use') return error(res, err.message, 409);
      next(err);
    }
  }

  async login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = loginSchema.parse(req.body);
      const result = await service.login(dto);
      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
      return success(res, { user: result.user, accessToken: result.accessToken });
    } catch (err: any) {
      if (err.message === 'Invalid credentials') return unauthorized(res, err.message);
      next(err);
    }
  }

  async refresh(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) return unauthorized(res);
      const result = await service.refresh(token);
      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
      return success(res, { accessToken: result.accessToken });
    } catch (err: any) {
      return unauthorized(res, err.message);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response) {
    const token = req.cookies?.refreshToken;
    if (token) await service.logout(token);
    res.clearCookie('refreshToken');
    return res.status(204).send();
  }

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await service.getMe(req.user!.id);
      return success(res, user);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = updateProfileSchema.parse(req.body);
      const user = await service.updateProfile(req.user!.id, dto);
      return success(res, user);
    } catch (err) {
      next(err);
    }
  }
}
