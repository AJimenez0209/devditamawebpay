import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import upload from '../middleware/uploadImage.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products — público
router.get('/', getAllProducts);

// GET /api/products/:id — público
router.get('/:id', getProductById);

// POST /api/products — requiere autenticación y archivo de imagen
router.post('/', protect, admin, upload.single('image'), createProduct);

// PUT /api/products/:id — requiere autenticación y archivo de imagen
router.put('/:id', protect, admin, upload.single('image'), updateProduct);

// DELETE /api/products/:id — requiere autenticación
router.delete('/:id', protect, admin, deleteProduct);

export default router;
