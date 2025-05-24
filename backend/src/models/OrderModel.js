import pool from '../db/db.js';

export async function createOrder(order, items) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderRes = await client.query(
      `INSERT INTO orders
         (customer_name,email,phone,country,city,postal_code,subtotal,shipping,total)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
      [
        order.customer_name,
        order.email,
        order.phone,
        order.country,
        order.city,
        order.postal_code,
        order.subtotal,
        order.shipping,
        order.total
      ]
    );
    const orderId = orderRes.rows[0].id;

    const insertItemText = `
      INSERT INTO order_items
        (order_id, product_code, quantity, price)
      VALUES ($1, $2, $3, $4)
    `;
    for (let itm of items) {
      await client.query(insertItemText, [
        orderId,
        itm.product_code,
        itm.quantity,
        itm.price
      ]);
    }

    await client.query('COMMIT');
    return { orderId };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}