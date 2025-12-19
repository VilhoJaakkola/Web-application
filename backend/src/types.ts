import {
  ColumnType,
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
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface PostTable {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}
