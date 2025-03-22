import { type DB, type users } from './types';

type OverrideCommonFields<Model> = Omit<
  Model,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> & {
  id: number;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string | null;
};

export type User = OverrideCommonFields<users>;

export type KyselySchema = DB;
