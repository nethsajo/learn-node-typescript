import bcrypt from 'bcrypt';

export const SALT_ROUNDS = 12;

export type HashTextArgs = {
  text: string;
  saltRounds?: number;
};

export function hashText({ text, saltRounds = SALT_ROUNDS }: HashTextArgs) {
  return bcrypt.hashSync(text, saltRounds);
}
