import { STAGES } from '@/constants/env';
import { envConfig } from '@/env';
import { ForbiddenError } from '@/utils/errors';
import type { NextFunction, Request, Response } from 'express';

export function isNotProduction(request: Request, response: Response, next: NextFunction) {
  if (envConfig.STAGE === STAGES.Prod) {
    throw new ForbiddenError('Not allowed');
  }

  next();
}
