import type { accounts, DB, locations, sessions, users } from './types';

type OverrideCommonFields<Schema> = Omit<
  Schema,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> & {
  id: number;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string | null;
};

export type Account = OverrideCommonFields<accounts>;
export type User = OverrideCommonFields<users>;
export type Session = OverrideCommonFields<sessions>;
export type Location = OverrideCommonFields<locations>;

export type KyselySchema = DB;
