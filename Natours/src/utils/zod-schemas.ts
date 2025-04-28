import { z } from 'zod';

export const emailSchema = z.string().email('Please enter a valid email address').toLowerCase();
/**  Add refine if email has own domain
 * export const emailSchema = z.string()
 * 	.email('Please enter a valid email address')
 * 	.toLowerCase()
 * 	.refine(value => value.endsWith('@sample.com'), {
			message: 'Email must end with @sample.com',
		});
 * */

const passwordValidationMessages = [
  'Password must be at least 8 characters long',
  'Password must have 1 lowercase',
  'Password must have 1 uppercase ',
  'Password must have 1 special character, and 1 number.',
  'Password should not exceed 16 characters',
];

export const passwordSchema = z.string().refine(value => {
  const minLength = value.length >= 8;
  const maxLength = value.length <= 16;
  const hasLowerCase = /[a-z]/.test(value);
  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

  return minLength && maxLength && hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
}, passwordValidationMessages.join('\n'));

export const paginationSchema = z.object({
  total_pages: z.number(),
  current_page: z.number(),
  next_page: z.number().nullable(),
  previous_page: z.number().nullable(),
});

export const listQuerySchema = z.object({
  limit: z.coerce.number().optional().default(25),
  page: z.coerce.number().optional().default(1),
  order_by: z.enum(['asc', 'desc']).optional(),
  include_archived: z.enum(['true', 'false']).optional(),
});
