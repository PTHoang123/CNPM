import { findAllFoods, findFoodByCode } from '../models/FoodModel.js';
// 1.2 Liệt kê ra danh sách món ăn
export async function getAllFoods(req, res) {
  try {
    const foods = await findAllFoods();
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch foods' });
  }
}


// 1.4 Hiển thị chi tiết món ăn
export async function getFoodByCode(req, res) {
  try {
    const { id } = req.params;
    const food = await findFoodByCode(id);
    if (!food) return res.status(404).json({ error: 'Not found' });
    res.json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch food' });
  }
}