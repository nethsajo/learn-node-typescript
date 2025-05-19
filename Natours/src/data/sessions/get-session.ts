import { type DbClient } from '@/db/create-db-client';
import { type Account } from '@/db/schema';
import { BadRequestError, NotFoundError } from '@/utils/errors';

export type GetSessionDataArgs = {
  dbClient: DbClient;
  id?: number;
  accountId: Account['id'];
};

export async function getSessionData({ dbClient, id, accountId }: GetSessionDataArgs) {
  if (!id && !accountId) {
    throw new BadRequestError('Either id or accountId must be provided');
  }

  const query = dbClient.selectFrom('sessions');

  if (id) {
    query.where('id', '=', id);
  }

  if (accountId) {
    query.where('account_id', '=', accountId);
  }

  const record = await query
    .selectAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('Session not found.'));

  return record;
}
