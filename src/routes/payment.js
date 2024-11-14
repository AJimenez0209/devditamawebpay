const express = require('express');
const { WebpayPlus } = require('transbank-sdk');
const transbankConfig = require('../config/transbank');
const { validateMallTransaction } = require('../middleware/validateTransaction');
const auth = require('../middleware/auth');

const router = express.Router();
const config = process.env.NODE_ENV === 'production' ? transbankConfig.production : transbankConfig.integration;

// Create mall transaction
router.post('/mall/create', [auth, validateMallTransaction], async (req, res) => {
  try {
    const { items, orderId } = req.body;
    const sessionId = `SESSION_${Date.now()}`;
    const returnUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/result`;

    const tx = new WebpayPlus.MallTransaction(config.mall);
    
    // Create transaction details with proper validation
    const details = items.map((item) => {
      const store = config.stores[item.storeIndex];
      if (!store) {
        throw new Error(`Índice de tienda inválido: ${item.storeIndex}`);
      }

      // Ensure proper formatting of buyOrder
      const buyOrder = `${orderId}-${store.commerceCode}`.slice(0, 26);
      
      return {
        amount: Math.round(item.amount),
        commerceCode: store.commerceCode,
        buyOrder
      };
    });

    const response = await tx.create(
      orderId.slice(0, 26), // Ensure orderId doesn't exceed max length
      sessionId,
      returnUrl,
      details
    );

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

// Confirm mall transaction
router.post('/mall/confirm', async (req, res) => {
  try {
    const { token_ws } = req.body;
    
    if (!token_ws) {
      return res.status(400).json({ 
        message: 'Token de transacción no proporcionado' 
      });
    }

    const tx = new WebpayPlus.MallTransaction(config.mall);
    const response = await tx.commit(token_ws);

    const allAuthorized = response.details.every(detail => detail.status === 'AUTHORIZED');

    if (allAuthorized) {
      res.json({
        status: 'success',
        response: {
          vci: response.vci,
          details: response.details,
          cardDetail: response.card_detail,
          accountingDate: response.accounting_date,
          transactionDate: response.transaction_date
        }
      });
    } else {
      res.json({
        status: 'rejected',
        response: {
          vci: response.vci,
          details: response.details
        }
      });
    }
  } catch (error) {
    console.error('Error confirming mall transaction:', error);
    res.status(500).json({ 
      message: 'Error al confirmar el pago', 
      error: error.message 
    });
  }
});

// Get transaction status
router.get('/mall/status/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const tx = new WebpayPlus.MallTransaction(config.mall);
    const response = await tx.status(token);

    res.json({
      status: 'success',
      response
    });
  } catch (error) {
    console.error('Error getting transaction status:', error);
    res.status(500).json({
      message: 'Error al obtener el estado de la transacción',
      error: error.message
    });
  }
});

module.exports = router;