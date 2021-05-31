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
  shipping_address VARCHAR(100),
  payment_method INTEGER,
  total_price INTEGER,
  is_paid BOOLEAN,
  paid_at TIMESTAMPTZ,
  is_delivered BOOLEAN,
  delivered_at TIMESTAMPTZ,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
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