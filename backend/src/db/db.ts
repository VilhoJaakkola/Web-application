import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';



const dialect = new PostgresDialect({
  pool: new Pool({
    host: 'localhost',
    port: 5432,
    database: 'webappdb',
    user: 'webappuser',
    password: 'securepassword',
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
