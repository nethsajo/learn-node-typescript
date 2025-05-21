import type { NextFunction, Request, Response } from 'express';

import { createDbClient } from '@/db/create-db-client';

const dbClient = createDbClient();

export async function setupDbClientMiddleware(request: Request, response: Response, next: NextFunction) {
  request.dbClient = dbClient;
  next();
}
