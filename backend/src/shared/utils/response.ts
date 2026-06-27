import { Response } from 'express';
import { ApiResponse } from '../types';

export function success<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data } as ApiResponse<T>);
}

export function created<T>(res: Response, data: T) {
  return success(res, data, 201);
}

export function noContent(res: Response) {
  return res.status(204).send();
}

export function error(res: Response, message: string, status = 400) {
  return res.status(status).json({ success: false, error: message } as ApiResponse<never>);
}

export function notFound(res: Response, message = 'Resource not found') {
  return error(res, message, 404);
}

export function unauthorized(res: Response, message = 'Unauthorized') {
  return error(res, message, 401);
}

export function forbidden(res: Response, message = 'Forbidden') {
  return error(res, message, 403);
}

export function serverError(res: Response, message = 'Internal server error') {
  return error(res, message, 500);
}
