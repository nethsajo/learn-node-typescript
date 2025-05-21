import type { DbClient } from '@/db/create-db-client';

import type { CreateUser } from './schema';

export type CreateUserDataArgs = {
  dbClient: DbClient;
  values: CreateUser;
};

export async function createUserData({ dbClient, values }: CreateUserDataArgs) {
  const result = await dbClient.insertInto('users').values(values).executeTakeFirstOrThrow();

  const insertedId = result.insertId;

  if (insertedId === undefined) throw new Error('Failed to retrieve inserted id from the database');

  // Fetch the inserted record using the generated ID
  const createdRecord = await dbClient
    .selectFrom('users')
    .selectAll()
    .where('id', '=', Number(insertedId))
    .executeTakeFirstOrThrow();

  return createdRecord;
}
