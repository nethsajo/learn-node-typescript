import { STAGES, type Stage } from '@/constants/env';

/**
 * httpOnly - Prevents JavaScript access
 * secure - CRITICAL: For any non-production environment, disable secure flag. This allows HTTP localhost frontends to receive cookies from HTTPS APIs
 * sameSite - Allow cross-origin in dev/staging
 * path - Available across the entire site
 * maxAge - The lifetime of a cookie in seconds
 */

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge: number;
  signed: boolean;
}

export function getAccessTokenCookieOptions(stage: Stage): CookieOptions {
  const isProduction = stage === STAGES.Prod;

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
    maxAge: 5 * 60 * 1000, // 1 day (in seconds)
    signed: true,
  };
}

export function getRefreshTokenCookieOptions(stage: Stage): CookieOptions {
  const isProduction = stage === STAGES.Prod;

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days (in seconds)
    signed: true,
  };
}

export interface DeleteCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  path: string;
}

export function getDeleteCookieOptions(stage: Stage): DeleteCookieOptions {
  const isProduction = stage === STAGES.Prod;

  return {
    httpOnly: true,
    secure: isProduction,
    path: '/',
  };
}
