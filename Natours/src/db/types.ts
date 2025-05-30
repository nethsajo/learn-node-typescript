import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type accounts = {
    id: Generated<number>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    email: string;
    password: string;
};
export type locations = {
    id: Generated<number>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    name: string | null;
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
    accounts: accounts;
    locations: locations;
    sessions: sessions;
    users: users;
};
