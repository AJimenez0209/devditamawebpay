const express = require('express');
const { WebpayPlus, TransactionDetail } = require('transbank-sdk');
const { transbankConfig } = require('../config/transbank');
const { validateMallTransaction } = require('../middleware/validateTransaction');

const router = express.Router();

// Crear transacción mall
router.post('/mall/create', validateMallTransaction, async (req, res) => {
  try {
    const { items, orderId } = req.body;
    const sessionId = `SESSION_${Date.now()}`;
    const returnUrl = `${process.env.FRONTEND_URL}/payment/result`;

    // Usa TransactionDetail en cada detalle de la transacción
    const details = items.map((item, index) => {
      const store = transbankConfig.stores[item.storeIndex];
      return new TransactionDetail(
        Math.round(item.amount),
        store.commerceCode,
        `${orderId.slice(0, 10)}-${store.commerceCode}`.slice(0, 26)
      );
    });

    const tx = new WebpayPlus.MallTransaction(transbankConfig.mall);
    const response = await tx.create(orderId, sessionId, returnUrl, details);

    res.json({
      token: response.token,
      url: response.url,
    });
  } catch (error) {
    console.error('Error creating mall transaction:', error);
    res.status(500).json({ 
      message: 'Error al procesar el pago', 
      error: error.message 
    });
  }
});

module.exports = router;
