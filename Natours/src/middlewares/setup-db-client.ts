import { createDbClient } from '@/db/create-db-client';
import { type NextFunction, type Request, type Response } from 'express';

const dbClient = createDbClient();

export async function setupDbClientMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {}
