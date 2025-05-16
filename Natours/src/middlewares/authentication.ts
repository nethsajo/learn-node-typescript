import { type NextFunction, type Request, type Response } from 'express';

import { COOKIE_NAMES } from '@/constants/cookies';
import { decodeJWT } from '@/lib/jwt';
import { type AccessTokenJWTPayload } from '@/types/auth';
import { UnauthorizedError } from '@/utils/errors';

export async function authenticationMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // const dbClient = request.dbClient;

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

  next();
}
