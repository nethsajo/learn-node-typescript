import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type account_role = {
    account_id: number;
    role_id: number;
};
export type accounts = {
    id: Generated<number>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    email: string;
    username: string | null;
    password: string;
    reset_code: string | null;
    reset_code_expires: Timestamp | null;
    reset_attempts: Generated<number>;
    reset_blocked_until: Timestamp | null;
};
export type permission_role = {
    role_id: number;
    permission_id: number;
};
export type permissions = {
    id: Generated<number>;
    name: string;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
};
export type roles = {
    id: Generated<number>;
    name: string;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
};
export type sessions = {
    id: Generated<number>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    refresh_token: string;
    account_id: number | null;
};
export type users = {
    id: Generated<number>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    first_name: string | null;
    last_name: string | null;
    account_id: number | null;
};
export type DB = {
    account_role: account_role;
    accounts: accounts;
    permission_role: permission_role;
    permissions: permissions;
    roles: roles;
    sessions: sessions;
    users: users;
};
