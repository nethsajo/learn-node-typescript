import type { NextFunction, Request, Response } from 'express';

import { COOKIE_NAMES } from '@/constants/cookies';
import { envConfig } from '@/env';
import { decodeJWT, verifyJWT } from '@/lib/jwt';
import { refreshSessionAuthService } from '@/services/auth/refresh-session';
import type { AccessTokenJWTPayload, Session } from '@/types/auth';
import { makeError, UnauthorizedError } from '@/utils/errors';
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from '@/utils/cookie-options';

export async function authenticationMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const accessToken = request.signedCookies[COOKIE_NAMES.accessToken];
  const refreshToken = request.signedCookies[COOKIE_NAMES.refreshToken];

  if (!accessToken || !refreshToken) {
    throw new UnauthorizedError('Authentication required');
  }

  if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
    throw new UnauthorizedError('Invalid authentication tokens');
  }

  const accessTokenPayload = decodeJWT<AccessTokenJWTPayload>({ token: accessToken });

  if (!accessTokenPayload) {
    throw new UnauthorizedError('Invalid authentication token');
  }

  const session: Session = {
    email: accessTokenPayload.email,
    accountId: accessTokenPayload.accountId,
    sessionId: accessTokenPayload.sessionId,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  try {
    verifyJWT<AccessTokenJWTPayload>({
      token: accessToken,
      secretOrPrivateKey: envConfig.JWT_ACCESS_TOKEN_SECRET,
    });

    request.session = session;
  } catch (err) {
    const error = makeError(err as Error);
    if (error.error.message.toLowerCase().includes('token expired')) {
      await refreshUserSession({ request, response, session, refreshToken });
    } else {
      throw new UnauthorizedError('Invalid authentication token');
    }
  }

  next();
}

type RefreshUserSessionArgs = {
  request: Request;
  response: Response;
  session: Session;
  refreshToken: string;
};

const refreshUserSession = async ({
  request,
  response,
  session,
  refreshToken,
}: RefreshUserSessionArgs): Promise<void> => {
  const dbClient = request.dbClient;

  const {
    account,
    sessionId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  } = await refreshSessionAuthService({ dbClient, payload: { session, refreshToken } });

  request.session = {
    email: account.email,
    accountId: account.id,
    sessionId: sessionId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  } satisfies Session;

  response.cookie(
    COOKIE_NAMES.accessToken,
    newAccessToken,
    getAccessTokenCookieOptions(envConfig.STAGE)
  );

  response.cookie(
    COOKIE_NAMES.refreshToken,
    newRefreshToken,
    getRefreshTokenCookieOptions(envConfig.STAGE)
  );
};
