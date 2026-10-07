import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protectOwner } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protectOwner, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protectOwner, updateProduct)
  .delete(protectOwner, deleteProduct);

export default router;
