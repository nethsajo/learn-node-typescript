import type { DbClient } from '@/db/create-db-client';
import type { UpdateUser } from './schema';
import type { User } from '@/db/schema';
import { sql } from 'kysely';
import { NotFoundError } from '@/utils/errors';

export type UpdateUserDataArgs = {
  dbClient: DbClient;
  id: User['id'];
  values: UpdateUser;
};

export async function updateUserData({ dbClient, id, values }: UpdateUserDataArgs) {
  await dbClient
    .updateTable('users')
    .set({ ...values, updated_at: sql`NOW()` })
    .where('id', '=', id)
    .execute();

  const updatedRecord = await dbClient
    .selectFrom('users')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirstOrThrow(() => new NotFoundError('User not found'));

  return updatedRecord;
}
