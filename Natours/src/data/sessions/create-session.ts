import { type DbClient } from '@/db/create-db-client';

import { type CreateSession } from './schema';

export type CreateSessionArgs = {
  dbClient: DbClient;
  values: CreateSession;
};

export async function createSessionData({ dbClient, values }: CreateSessionArgs) {
  const result = await dbClient.insertInto('sessions').values(values).executeTakeFirstOrThrow();

  const insertedId = result.insertId;

  if (insertedId === undefined) throw new Error('Failed to retrieve inserted id from the database');

  const createdRecord = await dbClient
    .selectFrom('sessions')
    .selectAll()
    .where('id', '=', Number(insertedId))
    .executeTakeFirstOrThrow();

  return createdRecord;
}
