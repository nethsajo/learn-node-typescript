import { makeError } from '@/utils/errors';
import { type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';

export function errorHandlerMiddleware(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log(err instanceof ZodError);
  const { error, statusCode } = makeError(err);
  return response.status(statusCode).json({ error });
}
