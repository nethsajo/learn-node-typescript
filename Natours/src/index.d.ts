import { type DbClient } from '@/db/create-db-client';

import { type Session } from './types/auth';

declare global {
  namespace Express {
    interface Request {
      dbClient: DbClient;
      session?: Session;
    }
  }
}
