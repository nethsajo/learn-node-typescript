import type { NextFunction, Request, Response } from 'express';

import { makeError } from '@/utils/errors';
import { logger } from '@/utils/logger';

export async function errorHandlerMiddleware(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { error, statusCode } = makeError(err);
  logger.error(error.message, error);
  return response.status(statusCode).json(error);
}
