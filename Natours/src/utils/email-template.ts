import { textify } from 'html-textify';

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export function getForgotPasswordTemplate({
  email,
  resetCode,
}: {
  email: string;
  resetCode: string;
}): EmailTemplate {
  const subject = 'Password Reset Request';

  const html = `
		<div style="max-width:600px; margin:0 auto; padding:20px; background-color:#fff;">
			<div style="padding:30 20px;">
				<div style="text-align:center; padding-bottom:20px;">
					<p>Template Express Prisma Kysely</p>
				</div>
				<h2>Password Reset Request</h2>
				<p>Hi there,</p>
				<p>We received a request to reset your password for your account. Use the code below to reset your password:</p>
				<div style="background-color:#f3f8fc; border:1px solid #e1f0f1; border-radius:8px; padding:30px 20px; margin:20px 0; text-align:center;">
					<div style="font-size:36px; font-weight:bold; letter-spacing:6px; color:#1081d3; font-family: 'Courier New', monospace;">
						${resetCode}
					</div> 
				</div>
				<div style="background-color:#fff8f3; border:1px solid #f59e0b; border-radius:8px; padding:15px; margin:20px 0; font-size:14px;">
					<strong>Important:</strong>
					<ul style="style="margin:10px 0; padding-left:20px;">
						<li>This code will expire in <strong>10 minutes</strong></li>
						<li>You have <strong>3 attempts</strong> to enter the correct code</li>
						<li>After 3 failed attempts, you'll be blocked for 15 minutes</li>
						<li>If you didn't request this, please ignore this email</li>
					</ul>
				</div>
				<p>For security reasons, never share this code with anyone. Our staff will never ask for your password reset code.</p>
				<p>If you have any questions or need help, please contact our support team at <a href="mailto:${email}" target="_blank">${email}</a></p>
				<p>Best Regards,<br>The Team</p>
				<div style="font-size:14px; text-align:center; padding:20px; color:#666; border-top:1px solid #f0f0f0;">
					<p>You're receiving this email because a password reset was requested for <a href="mailto:${email}" target="_blank">${email}</a></p>
					<p>© 2025. All rights reserved.</p>
				</div>
			</div>
		</div>
	`;

  const text = textify({ html, preserveFormatting: true });

  return { subject, html, text };
}
