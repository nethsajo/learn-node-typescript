import jwt from 'jsonwebtoken';

import { getAccountData } from '@/data/accounts/get-account';
import { type DbClient } from '@/db/create-db-client';
import { envConfig } from '@/env';
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
  return await dbClient.transaction().execute(async dbClientTrx => {
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

    await dbClientTrx.deleteFrom('sessions').where('account_id', '=', existingAccount.id).execute();

    const newRefreshToken = jwt.sign(
      {
        id: existingAccount.id,
        email: existingAccount.email,
        iss: 'login',
        aud: 'bossneth.app',
      },
      envConfig.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    await dbClientTrx
      .insertInto('sessions')
      .values({ refresh_token: newRefreshToken, account_id: existingAccount.id })
      .execute();

    const newAccessToken = jwt.sign(
      {
        id: existingAccount.id,
        email: existingAccount.email,
        iss: 'login',
        aud: 'bossneth.app',
      },
      envConfig.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' }
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  });
}
