import express from 'express';
import Product from '../models/ProductModel.js';
import upload from '../middleware/uploadImage.js';
import { auth as protect, adminOnly as admin } from '../middleware/auth.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', getAllProducts);

// Obtener un producto por ID
router.get('/:id', getProductById);

// Crear producto con imagen (usa multer)
router.post('/', protect, admin, upload.single('image'), createProduct);

// Actualizar producto con imagen opcional
router.put('/:id', protect, admin, upload.single('image'), updateProduct);

// Eliminar producto
router.delete('/:id', protect, admin, deleteProduct);

export default router;
