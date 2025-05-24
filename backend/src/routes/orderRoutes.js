import { Router } from 'express';
import { addOrder } from '../controllers/OrderController.js';

const router = Router();

router.post('/', addOrder);

export default router;