import { Router } from 'express';
import { addToCart, getCartItems , removeCartItem } from '../controllers/CartController.js';

const router = Router();

router.post('/', addToCart);
router.get('/', getCartItems);
router.delete('/:id', removeCartItem);

export default router;