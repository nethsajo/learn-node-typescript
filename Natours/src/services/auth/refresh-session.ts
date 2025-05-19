import { getSessionData } from '@/data/sessions/get-session';
import { type DbClient } from '@/db/create-db-client';
import { envConfig } from '@/env';
import { decodeJWT, verifyJWT } from '@/lib/jwt';
import { type RefreshTokenJWTPayload, type Session } from '@/types/auth';
import { UnauthorizedError } from '@/utils/errors';

export type RefreshSessionAuthServiceDependencies = {
  getSessionData: typeof getSessionData;
  verifyJWT: typeof verifyJWT;
  decodeJWT: typeof decodeJWT;
};

export type RefreshSessionAuthServiceArgs = {
  dbClient: DbClient;
  payload: {
    session: Session;
    refreshToken: string;
  };
  dependencies?: RefreshSessionAuthServiceDependencies;
};

export async function refreshSessionAuthService({
  dbClient,
  payload,
  dependencies = {
    getSessionData,
    decodeJWT,
    verifyJWT,
  },
}: RefreshSessionAuthServiceArgs) {
  return await dbClient.transaction().execute(async dbClientTrx => {
    const refreshTokenPayload = dependencies.decodeJWT<RefreshTokenJWTPayload>({
      token: payload.refreshToken,
    });

    if (!refreshTokenPayload) {
      throw new UnauthorizedError('Refresh token is invalid');
    }

    dependencies.verifyJWT<RefreshTokenJWTPayload>({
      token: payload.refreshToken,
      secretOrPrivateKey: envConfig.JWT_REFRESH_TOKEN_SECRET,
    });
  });
}
