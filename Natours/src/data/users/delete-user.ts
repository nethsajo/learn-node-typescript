import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';
import { NotFoundError } from '@/utils/errors';

export type DeleteUserDataArgs = {
  dbClient: DbClient;
  id: User['id'];
};

export async function deleteUserData({ dbClient, id }: DeleteUserDataArgs) {
  await dbClient.deleteFrom('users').where('id', '=', id).execute();

  const deletedRecord = await dbClient
    .selectFrom('users')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirstOrThrow(() => new NotFoundError('User not found'));

  return deletedRecord;
}
