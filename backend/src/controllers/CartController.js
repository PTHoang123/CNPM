import { upsertCartItem, getAllCartItems , deleteCartItem } from "../models/cartModel.js";
// 1.5 người dùng thêm số lượng món ăn vào giỏ hàng
export async function addToCart(req, res) {
  try {
    const { product_code, quantity } = req.body;
    if (!product_code || !quantity) {
      return res.status(400).json({ error: 'product_code and quantity required' });
    }
    const item = await upsertCartItem(product_code, quantity);
    return res.status(201).json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to add to cart' });
  }
}
export async function getCartItems(req, res) {
  try {
    const items = await getAllCartItems();
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch cart items' });
  }
}
export async function removeCartItem(req, res) {
  try {
    const { id } = req.params;
    const item = await deleteCartItem(id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete cart item' });
  }
}