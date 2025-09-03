import { checkResetBlockedData } from '@/data/accounts/check-reset-blocked';
import { getAccountData } from '@/data/accounts/get-account';
import { setResetCodeData } from '@/data/accounts/set-reset-code';
import type { DbClient } from '@/db/create-db-client';
// import { envConfig } from '@/env';
import { BadRequestError } from '@/utils/errors';
import { generateResetCode } from '@/utils/generate-reset-code';
// import { Resend } from 'resend';

// const resend = new Resend(envConfig.RESEND_API_KEY);

export type RequestPasswordResetServiceDependencies = {
  checkResetBlockedData: typeof checkResetBlockedData;
  getAccountData: typeof getAccountData;
  generateResetCode: typeof generateResetCode;
  setResetCodeData: typeof setResetCodeData;
};

export type RequestPasswordResetServiceArgs = {
  dbClient: DbClient;
  email: string;
  dependencies?: RequestPasswordResetServiceDependencies;
};

export async function requestPasswordResetService({
  dbClient,
  email,
  dependencies = {
    checkResetBlockedData,
    getAccountData,
    generateResetCode,
    setResetCodeData,
  },
}: RequestPasswordResetServiceArgs) {
  const blockStatus = await dependencies.checkResetBlockedData({ dbClient, email });

  if (blockStatus.blocked) {
    throw new BadRequestError(
      `Too many reset attempts. Please try again in ${blockStatus.minutesLeft} minutes.`
    );
  }

  const account = await dependencies.getAccountData({ dbClient, email });

  // Always return success even if account doesn't exist (security)
  if (!account) {
    return {
      success: true,
      message: 'If an account exists with this email, a reset code has been sent.',
    };
  }

  // Generate reset code
  const resetCode = dependencies.generateResetCode();

  // Save reset code to database
  await setResetCodeData({ dbClient, accountId: account.id, resetCode });

  // Send email with reset code
  // const test = await resend.emails.send({
  //   from: 'nethsajo98@gmail.com',
  //   to: email,
  //   subject: 'Password Reset Code for APP_NAME',
  //   html: '<strong>It works!</strong>',
  // });

  return {
    success: true,
    message: 'If an account exists with this email, a reset code has been sent.',
  };
}

export type RequestPasswordResetServiceResponse = Awaited<
  ReturnType<typeof requestPasswordResetService>
>;
