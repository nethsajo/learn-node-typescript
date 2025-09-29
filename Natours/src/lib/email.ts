import type { EnvConfig } from '@/env';
import { Resend, type CreateEmailOptions } from 'resend';

export type SendEmailArgs = { env: EnvConfig } & Omit<CreateEmailOptions, 'from'>;

export async function sendEmail({ env, to, subject, html, text }: SendEmailArgs) {
  const resend = new Resend(env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to,
    subject,
    html,
    text: text || '',
  });
}
