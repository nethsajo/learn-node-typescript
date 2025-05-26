import type { NextFunction, Request, Response } from 'express';

import { COOKIE_NAMES } from '@/constants/cookies';
import { envConfig } from '@/env';
import { decodeJWT, verifyJWT } from '@/lib/jwt';
import { refreshSessionAuthService } from '@/services/auth/refresh-session';
import type { AccessTokenJWTPayload, Session } from '@/types/auth';
import { makeError, UnauthorizedError } from '@/utils/errors';

export async function authenticationMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const dbClient = request.dbClient;

  const storedAccessToken = request.signedCookies[COOKIE_NAMES.accessToken];
  const storedRefreshToken = request.signedCookies[COOKIE_NAMES.refreshToken];

  if (!storedAccessToken || !storedRefreshToken) {
    throw new UnauthorizedError('Session tokens are required');
  }

  if (typeof storedAccessToken !== 'string' || typeof storedRefreshToken !== 'string') {
    throw new UnauthorizedError('Session tokens are invalid');
  }

  const storedAccessTokenPayload = decodeJWT<AccessTokenJWTPayload>({ token: storedAccessToken });

  if (!storedAccessTokenPayload) {
    throw new UnauthorizedError('Session tokens are invalid');
  }

  async function refreshSession({
    session,
    refreshToken,
  }: {
    session: Session;
    refreshToken: string;
  }) {
    const {
      account,
      sessionId,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } = await refreshSessionAuthService({
      dbClient,
      payload: { session, refreshToken },
    });

    request.session = {
      email: account.email,
      accountId: account.id,
      sessionId: sessionId,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } satisfies Session;

    response.cookie(COOKIE_NAMES.accessToken, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 1000, // 30 secs
      signed: true,
    });

    response.cookie(COOKIE_NAMES.refreshToken, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
      signed: true,
    });
  }

  try {
    verifyJWT<AccessTokenJWTPayload>({
      token: storedAccessToken,
      secretOrPrivateKey: envConfig.JWT_ACCESS_TOKEN_SECRET,
    });

    request.session = {
      email: storedAccessTokenPayload.email,
      accountId: storedAccessTokenPayload.accountId,
      sessionId: storedAccessTokenPayload.sessionId,
      accessToken: storedAccessToken,
      refreshToken: storedRefreshToken,
    } satisfies Session;
  } catch (err) {
    const error = makeError(err as Error);

    if (error.error.message === 'Token expired') {
      await refreshSession({
        session: {
          email: storedAccessTokenPayload.email,
          accountId: storedAccessTokenPayload.accountId,
          sessionId: storedAccessTokenPayload.sessionId,
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
        },
        refreshToken: storedRefreshToken,
      });
    } else {
      throw new UnauthorizedError('Session tokens are invalid');
    }
  }

  next();
}
