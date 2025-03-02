import { Router } from 'express';
import { addProductToCart, purchaseCart } from '../controllers/cartController.js';
import { authenticateToken } from '../utils/verifyToken.js';
import { loadCart } from '../middleware/cartMiddleware.js';
import { isUser } from '../middleware/adminMiddleware.js';

const router = Router();

router.use(authenticateToken); 
router.use(loadCart); 

router.post('/:cid/products', isUser, addProductToCart);
router.post('/:cid/purchase', isUser, purchaseCart);

export default router;
