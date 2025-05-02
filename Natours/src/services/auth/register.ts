import { createAccountData } from '@/data/accounts/create-account';
import { getAccountData } from '@/data/accounts/get-account';
import { type DbClient } from '@/db/create-db-client';
import { hashText } from '@/lib/bcrypt';
import { BadRequestError } from '@/utils/errors';

export type RegisterAuthServiceDependencies = {
  getAccountData: typeof getAccountData;
  createAccountData: typeof createAccountData;
  hashText: typeof hashText;
};

export type RegisterAuthServiceArgs = {
  dbClient: DbClient;
  payload: {
    email: string;
    password: string;
  };
  dependencies?: RegisterAuthServiceDependencies;
};

export async function registerAuthService({
  dbClient,
  payload,
  dependencies = {
    getAccountData,
    createAccountData,
    hashText,
  },
}: RegisterAuthServiceArgs) {
  await dbClient.transaction().execute(async dbClientTrx => {
    const existingAccount = await dependencies.getAccountData({
      dbClient: dbClientTrx,
      email: payload.email,
    });

    if (existingAccount) throw new BadRequestError('Account already exists.');

    const hashedPassword = dependencies.hashText({ text: payload.password });

    await dependencies.createAccountData({
      dbClient: dbClientTrx,
      values: {
        email: payload.email,
        password: hashedPassword,
      },
    });
  });
}
