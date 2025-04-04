import express from 'express';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin/products', auth, adminOnly, (req, res) => {
  res.json({ message: 'Panel de administración de productos' });
});

export default router;
