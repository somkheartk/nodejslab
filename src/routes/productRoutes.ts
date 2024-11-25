import express from 'express';
import { getProducts, createProduct } from '../controllers/productController';

const router = express.Router();

router.get('/api', getProducts); // GET /products
router.post('/', createProduct); // POST /products

export default router;
