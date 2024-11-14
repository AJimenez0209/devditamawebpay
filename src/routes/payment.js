import express from 'express';
import { WebpayPlus } from 'transbank-sdk';
import { transbankConfig } from '../config/transbank.js';
import { validateMallTransaction } from '../middleware/validateTransaction.js';

const router = express.Router();
const config = process.env.NODE_ENV === 'production' ? transbankConfig.production : transbankConfig.integration;

// Create mall transaction
router.post('/mall/create', validateMallTransaction, async (req, res) => {
  try {
    const { items, orderId } = req.body;
    const sessionId = `SESSION_${Date.now()}`;
    const returnUrl = `${process.env.FRONTEND_URL}/payment/result`;

    const tx = new WebpayPlus.MallTransaction(config.mall);
    const details = items.map((item, index) => ({
      amount: Math.round(item.amount),
      commerceCode: config.stores[item.storeIndex].commerceCode,
      buyOrder: `${orderId}-${config.stores[item.storeIndex].commerceCode}`
    }));

    const response = await tx.create(
      orderId,
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

export default router;