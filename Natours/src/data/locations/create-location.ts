import { type DbClient } from '@/db/create-db-client';

import { type CreateLocation } from './schema';

export type CreateLocationDataArgs = {
  dbClient: DbClient;
  values: CreateLocation;
};

export async function createLocationData({ dbClient, values }: CreateLocationDataArgs) {
  const result = await dbClient.insertInto('locations').values(values).executeTakeFirstOrThrow();

  const insertId = result.insertId;

  if (insertId === undefined) {
    throw new Error('Failed to retrieve insertId from the database');
  }

  // Fetch the inserted record using the generated ID
  const createdRecord = await dbClient
    .selectFrom('locations')
    .selectAll()
    .where('id', '=', Number(insertId))
    .executeTakeFirstOrThrow();

  return createdRecord;
}
