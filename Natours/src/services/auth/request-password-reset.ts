import { checkResetBlockedData } from '@/data/accounts/check-reset-blocked';
import { getAccountData } from '@/data/accounts/get-account';
import { setResetCodeData } from '@/data/accounts/set-reset-code';
import type { DbClient } from '@/db/create-db-client';
import { envConfig } from '@/env';
import { sendEmail } from '@/lib/email';
import { getForgotPasswordTemplate } from '@/utils/email-templates';
import { BadRequestError } from '@/utils/errors';
import { generateResetCode } from '@/utils/generate-reset-code';

export type RequestPasswordResetServiceDependencies = {
  checkResetBlockedData: typeof checkResetBlockedData;
  getAccountData: typeof getAccountData;
  generateResetCode: typeof generateResetCode;
  setResetCodeData: typeof setResetCodeData;
  sendEmail: typeof sendEmail;
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
    sendEmail,
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

  const emailTemplate = getForgotPasswordTemplate({
    email,
    resetCode,
  });

  // Send email with reset code
  await dependencies.sendEmail({
    env: envConfig,
    to: email,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text,
  });

  return {
    success: true,
    message: 'If an account exists with this email, a reset code has been sent.',
  };
}

export type RequestPasswordResetServiceResponse = Awaited<
  ReturnType<typeof requestPasswordResetService>
>;
