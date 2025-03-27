import type { DbClient } from '@/db/create-db-client';
import type { User } from '@/db/schema';
import { NotFoundError } from '@/utils/errors';

export type GetUserDataArgs = {
  dbClient: DbClient;
  id: User['id'];
};

export async function getUserData({ dbClient, id }: GetUserDataArgs) {
  const record = await dbClient
    .selectFrom('users')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('User not found.'));

  return record;
}
