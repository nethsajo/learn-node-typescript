import { type DbClient } from '@/db/create-db-client';

import { type CreateAccount } from './schema';

export type CreateAccountArgs = {
  dbClient: DbClient;
  values: CreateAccount;
};

export async function createAccountData({ dbClient, values }: CreateAccountArgs) {
  const result = await dbClient
    .insertInto('accounts')
    .values({ ...values, email: values.email.trim().toLowerCase() })
    .executeTakeFirstOrThrow();

  const insertedId = result.insertId;

  if (insertedId === undefined) throw new Error('Failed to retrieve inserted id from the database');

  const createdRecord = await dbClient
    .selectFrom('accounts')
    .selectAll()
    .where('id', '=', Number(insertedId))
    .executeTakeFirstOrThrow();

  return createdRecord;
}
