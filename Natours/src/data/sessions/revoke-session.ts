import { type DbClient } from '@/db/create-db-client';
import { type Account } from '@/db/schema';

export type RevokeSessionArgs = {
  dbClient: DbClient;
  accountId: Account['id'];
};

export async function revokeSessionData({ dbClient, accountId }: RevokeSessionArgs) {
  await dbClient.deleteFrom('sessions').where('account_id', '=', accountId).execute();
}
