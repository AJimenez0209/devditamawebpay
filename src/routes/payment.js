const express = require('express');
const { WebpayPlus, Environment } = require('transbank-sdk');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Configuración de Webpay Plus usando el entorno correcto
const webpayPlus = new WebpayPlus.Transaction({
  commerceCode: process.env.TRANSBANK_STORE_CODE,
  apiKey: process.env.TRANSBANK_API_KEY,
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Integration,
});

// Rutas para crear y confirmar la transacción
router.post('/create', async (req, res) => {
  console.log("Request body:", req.body); // Agrega este log

  try {
    const { orderId, sessionId, amount } = req.body;

    // Verifica que los parámetros obligatorios estén presentes
    if (!orderId || !sessionId || !amount) {
      return res.status(400).json({ message: 'Parámetros de transacción faltantes o incorrectos' });
    }

    // Genera el returnUrl directamente en el backend
    const returnUrl = `${process.env.FRONTEND_URL}/payment/result`.replace(/([^:]\/)\/+/g, "$1");

    // Crea la transacción
    const response = await webpayPlus.create(orderId.toString(), sessionId.toString(), amount, returnUrl);

    res.json({ status: 'success', response });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error al crear la transacción', error: error.message });
  }
});


router.post('/confirm', async (req, res) => {
  try {
    const { token_ws } = req.body;

    if (!token_ws) {
      return res.status(400).json({ message: 'Token de transacción faltante' });
    }

    try {
      const response = await webpayPlus.commit(token_ws);

      if (response.status === 'AUTHORIZED' && response.response_code === 0) {
        res.json({ status: 'success', response });
      } else {
        res.status(400).json({ status: 'error', message: 'La transacción no fue autorizada', response });
      }
    } catch (error) {
      if (error.message.includes('Transaction already locked')) {
        console.error('Error confirming transaction: Transacción bloqueada');
        return res.status(409).json({ message: 'La transacción está bloqueada por otro proceso. Por favor, inténtalo más tarde.' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error confirming transaction:', error);
    res.status(500).json({ message: 'Error al confirmar el pago', error: error.message });
  }
});


module.exports = router;
