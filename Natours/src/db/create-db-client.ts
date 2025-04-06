import { Kysely, MysqlDialect } from 'kysely';
import mysql2 from 'mysql2';

import { envConfig } from '@/env';

import { type KyselySchema } from './schema';

export function createDbClient() {
  const dbClient = new Kysely<KyselySchema>({
    dialect: new MysqlDialect({
      pool: mysql2.createPool({
        uri: envConfig.DB_URL,
        connectTimeout: 1000,
        idleTimeout: 0,
      }),
    }),
  });

  return dbClient;
}

export type DbClient = ReturnType<typeof createDbClient>;
