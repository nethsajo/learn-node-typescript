import { sql } from 'kysely';

import type { DbClient } from '@/db/create-db-client';
import type { User } from '@/db/schema';
import { NotFoundError } from '@/utils/errors';

export type ArchiveDataUserArgs = {
  dbClient: DbClient;
  id: User['id'];
};

export async function archiveUserData({ dbClient, id }: ArchiveDataUserArgs) {
  await dbClient
    .updateTable('users')
    .set('deleted_at', sql`NOW()`)
    .where('id', '=', id)
    .execute();

  const updatedRecord = await dbClient
    .selectFrom('users')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirstOrThrow(() => new NotFoundError('User not found'));

  return updatedRecord;
}
