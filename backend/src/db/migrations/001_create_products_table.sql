CREATE TABLE IF NOT EXISTS products (
  id               SERIAL PRIMARY KEY,
  product_code     VARCHAR(10)  NOT NULL UNIQUE,  -- e.g. "01", "02"
  title            VARCHAR(255) NOT NULL,
  price            NUMERIC(10,2) NOT NULL,
  image01          TEXT,
  image02          TEXT,
  image03          TEXT,
  category         VARCHAR(100),
  description      TEXT,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS cart_items (
  product_code VARCHAR(10)  NOT NULL
    REFERENCES products(product_code)
    ON DELETE CASCADE,
    image         TEXT, 
  quantity     INTEGER      NOT NULL DEFAULT 1,
  PRIMARY KEY (product_code)
);

CREATE TABLE IF NOT EXISTS orders (
  id            SERIAL        PRIMARY KEY,
  customer_name VARCHAR(255)   NOT NULL,
  email         VARCHAR(255)   NOT NULL,
  phone         VARCHAR(50)    NOT NULL,
  country       VARCHAR(100)   NOT NULL,
  city          VARCHAR(100)   NOT NULL,
  postal_code   VARCHAR(20)    NOT NULL,
  subtotal      NUMERIC(10,2)  NOT NULL,
  shipping      NUMERIC(10,2)  NOT NULL,
  total         NUMERIC(10,2)  NOT NULL,
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id            SERIAL        PRIMARY KEY,
  order_id      INTEGER        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_code  VARCHAR(10)    NOT NULL REFERENCES products(product_code),
  quantity      INTEGER        NOT NULL,
  price         NUMERIC(10,2)  NOT NULL
);