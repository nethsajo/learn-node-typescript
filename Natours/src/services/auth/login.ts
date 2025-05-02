import { getAccountData } from '@/data/accounts/get-account';
import { type DbClient } from '@/db/create-db-client';
import { compareTextToHashedText } from '@/lib/bcrypt';
import { BadRequestError } from '@/utils/errors';

export type LoginAuthServiceDependencies = {
  getAccountData: typeof getAccountData;
  compareTextToHashedText: typeof compareTextToHashedText;
};

export type LoginAuthServiceArgs = {
  dbClient: DbClient;
  payload: {
    email: string;
    password: string;
  };
  dependencies?: LoginAuthServiceDependencies;
};

export async function loginAuthService({
  dbClient,
  payload,
  dependencies = {
    getAccountData,
    compareTextToHashedText,
  },
}: LoginAuthServiceArgs) {
  await dbClient.transaction().execute(async dbClientTrx => {
    const existingAccount = await dependencies.getAccountData({
      dbClient: dbClientTrx,
      email: payload.email,
    });

    if (!existingAccount) throw new BadRequestError('Account does not exist.');

    const isPasswordCorrect = dependencies.compareTextToHashedText({
      text: payload.password,
      hashedText: existingAccount.password,
    });

    if (!isPasswordCorrect) throw new BadRequestError('Invalid credentials.');
  });
}
