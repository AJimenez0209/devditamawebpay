import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post(
  '/',
  [
    body('items').isArray(),
    body('paymentMethod').isIn(['cash', 'card', 'transfer']),
    body('deliveryMethod').isIn(['pickup', 'delivery']),
    body('address').if(body('deliveryMethod').equals('delivery')).notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (req.body.paymentMethod === 'cash' && req.body.deliveryMethod === 'delivery') {
        return res.status(400).json({
          message: 'Cash payment is only available for store pickup',
        });
      }

      const order = new Order(req.body);
      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update order status
router.patch(
  '/:id/status',
  body('status').isIn(['pending', 'processing', 'completed', 'cancelled']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.status = req.body.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

export default router;
