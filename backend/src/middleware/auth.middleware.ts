import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticatedRequest } from '../shared/types';
import { unauthorized } from '../shared/utils/response';

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return unauthorized(res);
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      plan: string;
    };
    req.user = payload;
    next();
  } catch {
    return unauthorized(res, 'Invalid or expired token');
  }
}

export function requiresPremium(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user?.plan !== 'premium') {
    return res.status(403).json({ success: false, error: 'Premium plan required' });
  }
  next();
}
