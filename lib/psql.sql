CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(50) NOT NULL UNIQUE,
  role INTEGER NOT NULL DEFAULT 3,
  password VARCHAR(100),
  password_confirm VARCHAR(100),
  active BOOLEAN DEFAULT TRUE,
  password_reset_token VARCHAR(50),
  password_reset_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  image VARCHAR(50),
  brand VARCHAR(50),
  category VARCHAR(50),
  description VARCHAR(50),
  rating INTEGER DEFAULT 0,
  num_reviews INTEGER DEFAULT 0,
  price INTEGER DEFAULT 0,
  count_in_stock INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  postal_code VARCHAR(50),
  address VARCHAR(100),
  country VARCHAR(50),
  city VARCHAR(50),
  payment_method INTEGER,
  payment_result_status INTEGER NOT NULL DEFAULT 1,
  payment_result_update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_price INTEGER,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_delivered BOOLEAN NOT NULL DEFAULT FALSE,
  delivered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- TODO SET NOT NULL AFTER TESTING
-- TODO ADD OTHER TABLES, FOREIGN KEYS, INDEXES
-- TODO POPULATE DB WITH RAW DATA IN rawdata.sql

-- CREATE TYPE new_type AS (new_date timestamp, some_int bigint);
-- INSERT INTO new_table VALUES (
--     '9fd92c53-d0d8-4aba-7925-1ad648d565f2'::uuid,
--     ARRAY['("now", 146252)'::new_type,
--           '("now", 526685)'::new_type
--      ] );

-- update users set flags = array_remove(flags, 'active')
-- update new_table set new_type_list = array_remove(new_type_list, row('*', 12)::new_type) where id = 1; 