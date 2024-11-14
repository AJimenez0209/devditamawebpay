const express = require('express');
const { WebpayPlus } = require('transbank-sdk');
const { transbankConfig } = require('../config/transbank');
const { validateMallTransaction } = require('../middleware/validateTransaction');

const router = express.Router();
const config = process.env.NODE_ENV === 'production' ? transbankConfig.production : transbankConfig.integration;

// Create mall transaction
router.post('/mall/create', validateMallTransaction, async (req, res) => {
  try {
    const { items, orderId } = req.body;
    const sessionId = `SESSION_${Date.now()}`;
    const returnUrl = `${process.env.FRONTEND_URL}/payment/result`;

    const tx = new WebpayPlus.MallTransaction(config.mall);
    const details = items.map((item, index) => {
      const store = config.stores[item.storeIndex];
      if (!store) {
        throw new Error(`Invalid store index: ${item.storeIndex}`);
      }
      
      // Ajuste de longitud de buyOrder a un máximo de 26 caracteres
      const buyOrder = `${orderId.slice(0, 10)}-${store.commerceCode}`.slice(0, 26);
      
      return {
        amount: Math.round(item.amount),
        commerceCode: store.commerceCode,
        buyOrder: buyOrder // Usa la variable buyOrder ajustada
      };
    });

    const response = await tx.create(orderId, sessionId, returnUrl, details);
    res.json({
      token: response.token,
      url: response.url
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
