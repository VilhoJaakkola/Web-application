
------------------------------------------------------------
-- Functions
------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_table_update() RETURNS TRIGGER AS $$ BEGIN IF NEW.id IS DISTINCT
FROM OLD.id THEN RAISE EXCEPTION 'Cannot update id column in table %.%',
  TG_TABLE_SCHEMA,
  TG_TABLE_NAME;
END IF;
IF EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_schema = TG_TABLE_SCHEMA
    AND table_name = TG_TABLE_NAME
    AND column_name = 'updated_at'
) THEN NEW.updated_at = NOW();
END IF;
IF EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_schema = TG_TABLE_SCHEMA
    AND table_name = TG_TABLE_NAME
    AND column_name = 'created_at'
)
AND NEW.created_at IS DISTINCT
FROM OLD.created_at THEN RAISE EXCEPTION 'Cannot update created_at column in table %.%',
  TG_TABLE_SCHEMA,
  TG_TABLE_NAME;
END IF;
RETURN NEW;
END;
$$ language 'plpgsql';

------------------------------------------------------------
-- Tables
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users ON DELETE CASCADE
);

------------------------------------------------------------
-- Indexes and Triggers
------------------------------------------------------------

CREATE INDEX idx_posts_user_id ON posts(user_id);

CREATE TRIGGER users_update_handler BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION handle_table_update();

CREATE TRIGGER posts_update_handler BEFORE
UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION handle_table_update();

-- INSERT INTO users (first_name, last_name, email, password_hash) 
-- VALUES('Admin', 'User', 'admin@example.com', 'hashed_password');
-- INSERT INTO posts (user_id, title, content) 
-- VALUES((SELECT id FROM users WHERE email = 'admin@example.com'), 'First Post', 'This is the content of the first post.');