import { getAccountData } from '@/data/accounts/get-account';
import type { DbClient } from '@/db/create-db-client';
import { BadRequestError } from '@/utils/errors';
import { sendEmail } from '@/lib/email';
import { getLoginLinkTemplate } from '@/utils/email-templates';
import { envConfig } from '@/env';
import { generateLoginLinkToken } from '@/utils/generate-login-link-token';

export type LoginLinkRequestAuthServiceDependencies = {
  getAccountData: typeof getAccountData;
  generateLoginLinkToken: typeof generateLoginLinkToken;
  sendEmail: typeof sendEmail;
};

export type LoginLinkRequestAuthServiceArgs = {
  dbClient: DbClient;
  payload: {
    email?: string;
    username?: string;
  };
  dependencies?: LoginLinkRequestAuthServiceDependencies;
};

export async function loginLinkRequestAuthService({
  dbClient,
  payload,
  dependencies = {
    getAccountData,
    generateLoginLinkToken,
    sendEmail,
  },
}: LoginLinkRequestAuthServiceArgs) {
  const account = await dependencies.getAccountData({
    dbClient,
    email: payload.email,
    username: payload.username,
  });

  if (!account) {
    throw new BadRequestError('Account not found.');
  }

  const token = dependencies.generateLoginLinkToken();

  const emailTemplate = getLoginLinkTemplate({
    email: account.email,
    token,
  });

  // Send email with reset code
  await dependencies.sendEmail({
    env: envConfig,
    to: account.email,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text,
  });

  return 'A login link has been sent to your email.';
}

export type LoginLinkRequestServiceResponse = Awaited<
  ReturnType<typeof loginLinkRequestAuthService>
>;
