const express = require('express');
const { WebpayPlus } = require('transbank-sdk');
const { transbankConfig } = require('../config/transbank');
const { validateMallTransaction } = require('../middleware/validateTransaction');

const router = express.Router();

// Crear transacción mall
router.post('/mall/create', validateMallTransaction, async (req, res) => {
  try {
    const { items, orderId } = req.body;

    // Validar que items sea un array y tenga al menos un elemento
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Items must be a non-empty array");
    }

    const sessionId = `SESSION_${Date.now()}`;
    const returnUrl = `${process.env.FRONTEND_URL}/payment/result`;

    const tx = new WebpayPlus.MallTransaction(transbankConfig.mall);

    const details = items.map((item) => {
      const store = transbankConfig.stores[item.storeIndex];
      if (!store) {
        throw new Error(`Invalid store index: ${item.storeIndex}`);
      }
      const buyOrder = `${orderId.slice(0, 10)}-${store.commerceCode}`.slice(0, 26);
      return {
        amount: Math.round(item.amount),
        commerceCode: store.commerceCode,
        buyOrder
      };
    });

    const response = await tx.create(orderId, sessionId, returnUrl, details);

    res.json({
      token: response.token,
      url: response.url
    });
  } catch (error) {
    console.error('Error creating mall transaction:', error);
    res.status(500).json({ message: 'Error al procesar el pago', error: error.message });
  }
});

module.exports = router;
