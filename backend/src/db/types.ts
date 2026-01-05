import type {
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface Database {
  users: UserTable;
  posts: PostTable;
}

export interface UserTable {
  id: Generated<string>;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface PostTable {
  id: Generated<string>;
  user_id: string;
  title: string;
  content: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export type Post = Selectable<PostTable>;
export type NewPost = Insertable<PostTable>;
export type PostUpdate = Updateable<PostTable>;
