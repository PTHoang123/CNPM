import pool from '../db/db.js';

export async function upsertCartItem(product_code, quantity) {
  const { rows } = await pool.query(
    `WITH upsert AS (
       INSERT INTO cart_items (product_code, quantity)
       VALUES ($1, $2)
       ON CONFLICT (product_code)
         DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING product_code, quantity
     )
     SELECT u.product_code,
            u.quantity,
            p.image01    AS image
       FROM upsert u
  LEFT JOIN products p
         ON p.product_code = u.product_code;`,
    [product_code, quantity]
  );
  return rows[0];
}

export async function getAllCartItems() {
  const { rows } = await pool.query(`
    SELECT
      c.product_code,
      c.quantity,
      p.title,
      (p.price::FLOAT) AS price,
      p.image01    AS image
    FROM cart_items c
    LEFT JOIN products p ON p.product_code = c.product_code;
  `);
  return rows;
}

export async function deleteCartItem(product_code) {
  const { rows } = await pool.query(
    `DELETE FROM cart_items
         WHERE product_code = $1
      RETURNING product_code;`,
    [product_code]
  );
  return rows[0];
}
