import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { serverError } from '../shared/utils/response';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      error: 'Validation error',
      details: err.flatten().fieldErrors,
    });
  }

  console.error('Unhandled error:', err);
  return serverError(res);
}
