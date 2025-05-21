import type { JWTPayload } from '@/lib/jwt';

export type Session = {
  email: string;
  accountId: number;
  sessionId: number;
  accessToken: string;
  refreshToken: string;
};

export type AccessTokenJWTPayload = JWTPayload<{
  email: string;
  accountId: number;
  sessionId: number;
}>;

export type RefreshTokenJWTPayload = JWTPayload<{
  accountId: number;
}>;
