import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import type { Database } from './types';

const dialect = new PostgresDialect({
  pool: new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'webappdb',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'webapp123',
  }),
});

export const db = new Kysely<Database>({
  dialect,
  // in development, you can log
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});
