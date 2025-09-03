import { verifyResetCodeData } from '@/data/accounts/verify-reset-code';
import type { DbClient } from '@/db/create-db-client';
import { envConfig } from '@/env';
import { generateJWT } from '@/lib/jwt';
import { BadRequestError } from '@/utils/errors';

export type VerifyResetCodeServiceDependencies = {
  verifyResetCodeData: typeof verifyResetCodeData;
  generateJWT: typeof generateJWT;
};

export type VerifyResetCodeServiceArgs = {
  dbClient: DbClient;
  email: string;
  resetCode: string;
  dependencies?: VerifyResetCodeServiceDependencies;
};

export async function verifyResetCodeService({
  dbClient,
  email,
  resetCode,
  dependencies = {
    verifyResetCodeData,
    generateJWT,
  },
}: VerifyResetCodeServiceArgs) {
  const result = await dependencies.verifyResetCodeData({ dbClient, email, resetCode });

  if (!result.success) {
    if (result.blocked) {
      if ('minutesLeft' in result) {
        throw new BadRequestError(
          `Too many failed attempts. Please try again in ${result.minutesLeft} minutes.`
        );
      } else {
        throw new BadRequestError('Too many failed attempts. Please request a new code.');
      }
    }

    if ('attemptsLeft' in result && result.attemptsLeft !== undefined && result.attemptsLeft > 0) {
      throw new BadRequestError(`Invalid code. ${result.attemptsLeft} attempts remaining.`);
    }

    throw new BadRequestError(result.error || 'Invalid or expired code.');
  }

  const resetToken = dependencies.generateJWT({
    payload: {
      accountId: result.account.id,
      email: result.account.email,
      purpose: 'password-reset',
      sub: result.account.id,
      iss: 'login' as const,
      aud: 'frontend' as const,
    },
    secretOrPrivateKey: envConfig.JWT_PASSWORD_TOKEN_SECRET,
    signOptions: { expiresIn: '10m' }, // Short-lived token
  });

  return {
    success: true,
    resetToken,
  };
}

export type VerifyResetCodeServiceResponse = Awaited<ReturnType<typeof verifyResetCodeService>>;
