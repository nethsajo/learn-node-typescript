import { type DbClient } from '@/db/create-db-client';

declare global {
  namespace Express {
    interface Request {
      dbClient: DbClient;
    }
  }
}
