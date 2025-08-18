import { getAccountData } from '@/data/accounts/get-account';
import { getSessionData } from '@/data/sessions/get-session';
import { updateSessionData } from '@/data/sessions/update-session';
import type { DbClient } from '@/db/create-db-client';
import { envConfig } from '@/env';
import { decodeJWT, generateJWT, verifyJWT } from '@/lib/jwt';
import type { AccessTokenJWTPayload, RefreshTokenJWTPayload, Session } from '@/types/auth';
import { BadRequestError, UnauthorizedError } from '@/utils/errors';

export type RefreshSessionAuthServiceDependencies = {
  decodeJWT: typeof decodeJWT;
  verifyJWT: typeof verifyJWT;
  generateJWT: typeof generateJWT;
  getSessionData: typeof getSessionData;
  updateSessionData: typeof updateSessionData;
  getAccountData: typeof getAccountData;
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
    decodeJWT,
    verifyJWT,
    generateJWT,
    getSessionData,
    updateSessionData,
    getAccountData,
  },
}: RefreshSessionAuthServiceArgs) {
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

  const currentSession = await dependencies.getSessionData({
    dbClient,
    accountId: refreshTokenPayload.accountId,
  });

  if (!currentSession) throw new UnauthorizedError('Session not found');

  if (refreshTokenPayload.accountId !== payload.session.accountId) {
    throw new UnauthorizedError('Refresh token does not match session.');
  }

  if (currentSession.refresh_token !== payload.refreshToken) {
    throw new UnauthorizedError('Refresh token is invalid');
  }

  const newRefreshToken = dependencies.generateJWT<RefreshTokenJWTPayload>({
    payload: {
      accountId: refreshTokenPayload.accountId,
      sub: refreshTokenPayload.sub,
      iss: 'refresh',
      aud: 'frontend',
    },
    secretOrPrivateKey: envConfig.JWT_REFRESH_TOKEN_SECRET,
    signOptions: { expiresIn: '30d' },
  });

  // Update the session
  const updatedSession = await dependencies.updateSessionData({
    dbClient,
    id: currentSession.id,
    values: { refresh_token: newRefreshToken },
  });

  const account = await dependencies.getAccountData({
    dbClient,
    id: refreshTokenPayload.accountId,
  });

  if (!account) throw new BadRequestError('Account does not exist.');

  const newAccessToken = dependencies.generateJWT<AccessTokenJWTPayload>({
    payload: {
      email: account.email,
      accountId: account.id,
      sessionId: updatedSession.id,
      sub: account.id,
      iss: 'refresh',
      aud: 'frontend',
    },
    secretOrPrivateKey: envConfig.JWT_ACCESS_TOKEN_SECRET,
    signOptions: { expiresIn: '5m' },
  });

  return {
    account,
    sessionId: updatedSession.id,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
