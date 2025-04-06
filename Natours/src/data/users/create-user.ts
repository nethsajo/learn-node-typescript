import { type DbClient } from '@/db/create-db-client';

import { type CreateUser } from './schema';

export type CreateUserDataArgs = {
  dbClient: DbClient;
  values: CreateUser;
};

export async function createUserData({ dbClient, values }: CreateUserDataArgs) {
  const result = await dbClient.insertInto('users').values(values).executeTakeFirstOrThrow();

  const insertId = result.insertId;

  if (insertId === undefined) {
    throw new Error('Failed to retrieve insertId from the database');
  }

  // Fetch the inserted record using the generated ID
  const createdRecord = await dbClient
    .selectFrom('users')
    .selectAll()
    .where('id', '=', Number(insertId))
    .executeTakeFirstOrThrow();

  return createdRecord;
}
