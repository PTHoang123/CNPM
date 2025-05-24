import { Router } from 'express';
import { getAllFoods, getFoodByCode } from '../controllers/FoodController.js';

const router = Router();
router.get('/', getAllFoods);
router.get('/:id', getFoodByCode);

export default router;