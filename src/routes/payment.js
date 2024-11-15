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
router.post('/payment/create', async (req, res) => {
  try {
    const { orderId, sessionId, amount, returnUrl } = req.body;

    if (!orderId || !sessionId || !amount || !returnUrl) {
      return res.status(400).json({ message: 'Parámetros de transacción faltantes o incorrectos' });
    }

    const response = await webpayPlus.create(orderId.toString(), sessionId.toString(), amount, returnUrl);
    res.json({ status: 'success', response });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error al crear la transacción', error: error.message });
  }
});

router.post('/payment/confirm', async (req, res) => {
  try {
    const { token_ws } = req.body;

    if (!token_ws) {
      return res.status(400).json({ message: 'Token de transacción faltante' });
    }

    const response = await webpayPlus.commit(token_ws);

    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      res.json({ status: 'success', response });
    } else {
      res.status(400).json({ status: 'error', message: 'La transacción no fue autorizada', response });
    }
  } catch (error) {
    console.error('Error confirming transaction:', error);
    res.status(500).json({ message: 'Error al confirmar el pago', error: error.message });
  }
});

module.exports = router;
