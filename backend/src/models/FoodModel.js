import pool from '../db/db.js';

export async function findAllFoods() {
  const { rows } = await pool.query(
    `SELECT id, product_code, title, price,
            image01, image02, image03,
            category, description
     FROM products
     ORDER BY id`
  );
  return rows;
}


export async function findFoodByCode(product_code) {
  const { rows } = await pool.query(
    `SELECT id, product_code, title, price,
            image01, image02, image03,
            category, description
     FROM products
     WHERE product_code = $1`,
    [product_code]
  );
  return rows[0] || null;
}