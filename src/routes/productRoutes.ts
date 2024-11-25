import express from 'express';
import { getProducts, createProduct } from '../controllers/productController';

const router = express.Router();

router.get('/', getProducts); // GET /products
router.post('/', createProduct); // POST /products

export default router;
