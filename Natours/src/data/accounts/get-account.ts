import { type DbClient } from '@/db/create-db-client';
import { BadRequestError } from '@/utils/errors';

export type GetAccountDataArgs = {
  dbClient: DbClient;
  id?: number;
  email?: string;
};

export async function getAccountData({ dbClient, id, email }: GetAccountDataArgs) {
  if (!id && !email) throw new BadRequestError('Either id or email must be provided.');

  let query = dbClient.selectFrom('accounts');

  if (id) {
    query = query.where('id', '=', id);
  }

  if (email) {
    query = query.where('email', '=', email.trim().toLowerCase());
  }

  const record = await query.selectAll().executeTakeFirst();

  return record;
}
