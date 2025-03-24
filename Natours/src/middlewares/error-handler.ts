import { makeError } from '@/utils/errors';
import { type NextFunction, type Request, type Response } from 'express';

export async function errorHandlerMiddleware(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { error, statusCode } = makeError(err);

  return response.status(statusCode).json({ error });
}
