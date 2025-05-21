import { getAccountData } from '@/data/accounts/get-account';
import type { UpdateUser } from '@/data/users/schema';
import { updateUserData } from '@/data/users/update-user';
import type { DbClient } from '@/db/create-db-client';
import type { Account } from '@/db/schema';
import { BadRequestError } from '@/utils/errors';

export type UpdateUserServiceDependencies = {
  getAccountData: typeof getAccountData;
  updateUserData: typeof updateUserData;
};

export type UpdateUserServiceArgs = {
  dbClient: DbClient;
  payload: {
    accountId: Account['id'];
    values: UpdateUser;
  };
  dependencies?: UpdateUserServiceDependencies;
};
export async function updateUserService({
  dbClient,
  payload,
  dependencies = { getAccountData, updateUserData },
}: UpdateUserServiceArgs) {
  return await dbClient.transaction().execute(async dbClientTrx => {
    const existingAccount = await dependencies.getAccountData({
      dbClient: dbClientTrx,
      id: payload.accountId,
    });

    if (!existingAccount) {
      throw new BadRequestError('Account does not exist.');
    }

    const updatedUser = await dependencies.updateUserData({
      dbClient: dbClientTrx,
      accountId: payload.accountId,
      values: payload.values,
    });

    return updatedUser;
  });
}
