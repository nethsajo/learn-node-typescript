import { type NextFunction, type Request, type Response } from 'express';

import { createDbClient } from '@/db/create-db-client';

const dbClient = createDbClient();

export async function setupDbClientMiddleware(request: Request, response: Response, next: NextFunction) {
  next();
}
