import type { DbClient } from '@/db/create-db-client';
import type { UpdateSession } from './schema';
import { NotFoundError } from '@/utils/errors';
import { sql } from 'kysely';

export type UpdateSessionDataArgs = {
  dbClient: DbClient;
  id: number;
  values: UpdateSession;
};

export async function updateSessionData({ dbClient, id, values }: UpdateSessionDataArgs) {
  await dbClient
    .updateTable('sessions')
    .set({ ...values, updated_at: sql`NOW()` })
    .where('id', '=', id)
    .execute();

  const updatedRecord = await dbClient
    .selectFrom('sessions')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirstOrThrow(() => new NotFoundError('Session not found'));

  return updatedRecord;
}
