import type { accounts, DB, sessions, users } from './types';

type OverrideCommonFields<Schema> = Omit<
  Schema,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> & {
  id: number;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string | null;
};

type OverrideAccounts = Omit<
  OverrideCommonFields<accounts>,
  'reset_attempts' | 'reset_code_expires' | 'reset_blocked_until'
> & {
  reset_attempts: number;
  reset_code_expires: Date | string | null;
  reset_blocked_until: Date | string | null;
};

export type Account = OverrideAccounts;
export type User = OverrideCommonFields<users>;
export type Session = OverrideCommonFields<sessions>;

export type KyselySchema = DB;
