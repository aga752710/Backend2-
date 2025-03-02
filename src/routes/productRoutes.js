import { Router } from 'express';
import { createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authenticateToken } from '../utils/verifyToken.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { getProductById } from '../controllers/productController.js';

const router = Router();

router.use(authenticateToken); 

router.get('/:id', getProductById);
router.post('/', isAdmin, createProduct);
router.put('/:id', isAdmin, updateProduct);
router.delete('/:id', isAdmin, deleteProduct);

export default router;
