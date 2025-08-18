import { getAccountData } from '@/data/accounts/get-account';
import { createSessionData } from '@/data/sessions/create-session';
import { revokeSessionData } from '@/data/sessions/revoke-session';
import type { DbClient } from '@/db/create-db-client';
import { envConfig } from '@/env';
import { compareTextToHashedText } from '@/lib/bcrypt';
import { generateJWT } from '@/lib/jwt';
import type { AccessTokenJWTPayload, RefreshTokenJWTPayload } from '@/types/auth';
import { BadRequestError } from '@/utils/errors';

export type LoginAuthServiceDependencies = {
  getAccountData: typeof getAccountData;
  compareTextToHashedText: typeof compareTextToHashedText;
  revokeSessionData: typeof revokeSessionData;
  generateJWT: typeof generateJWT;
  createSessionData: typeof createSessionData;
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
    revokeSessionData,
    generateJWT,
    createSessionData,
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

    if (!isPasswordCorrect) throw new BadRequestError('Invalid credentials');

    await dependencies.revokeSessionData({ dbClient: dbClientTrx, accountId: existingAccount.id });

    const newRefreshToken = dependencies.generateJWT<RefreshTokenJWTPayload>({
      payload: {
        accountId: existingAccount.id,
        sub: existingAccount.id,
        iss: 'login',
        aud: 'frontend',
      },
      secretOrPrivateKey: envConfig.JWT_REFRESH_TOKEN_SECRET,
      signOptions: { expiresIn: '30d' }, // ideal lifetime is 7d to 30d
    });

    const createdSession = await dependencies.createSessionData({
      dbClient: dbClientTrx,
      values: { refresh_token: newRefreshToken, account_id: existingAccount.id },
    });

    const newAccessToken = dependencies.generateJWT<AccessTokenJWTPayload>({
      payload: {
        email: existingAccount.email,
        accountId: existingAccount.id,
        sessionId: createdSession.id,
        sub: existingAccount.id,
        iss: 'login',
        aud: 'frontend',
      },
      secretOrPrivateKey: envConfig.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '5m' }, // ideal lifetime is 5m to 15m
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  });
}
