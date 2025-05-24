import { createOrder } from '../models/OrderModel.js';

export async function addOrder(req, res) {
  try {
    const { customer_name, email, phone, country, city, postal_code, subtotal, shipping, total, items } = req.body;
    if (!customer_name || !email || !items?.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await createOrder(
      { customer_name, email, phone, country, city, postal_code, subtotal, shipping, total },
      items
    );
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
}