const express = require('express');
const { WebpayPlus, Environment } = require('transbank-sdk');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();
const activeTokens = new Set();

const webpayPlus = new WebpayPlus.Transaction({
  commerceCode: process.env.TRANSBANK_STORE_CODE,
  apiKey: process.env.TRANSBANK_API_KEY,
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Integration,
});

router.post('/create', async (req, res) => {
  try {
    const { orderId, sessionId, amount } = req.body;
    if (!orderId || !sessionId || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Parámetros de transacción faltantes o incorrectos' });
    }

    const returnUrl = `${process.env.FRONTEND_URL}/payment/result`.replace(/([^:]\/)\/+/g, "$1");
    const response = await webpayPlus.create(orderId.toString(), sessionId.toString(), amount, returnUrl);
    res.json({ status: 'success', response });
  } catch (error) {
    console.error('Error creando la transacción:', error);
    res.status(500).json({ message: 'Error al crear la transacción', error: error.message });
  }
});

router.post('/confirm', async (req, res) => {
  const { token_ws } = req.body;

  if (!token_ws) {
    return res.status(400).json({ message: 'Token de transacción no encontrado' });
  }

  console.log(`Confirmando transacción con token: ${token_ws}`);

  if (activeTokens.has(token_ws)) {
    console.log(`Token ${token_ws} ya está en proceso.`);
    return res.status(409).json({ message: 'La transacción ya está siendo procesada.' });
  }

  activeTokens.add(token_ws);

  try {
    const response = await webpayPlus.commit(token_ws);

    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      res.json({ status: 'success', response });
    } else {
      res.status(400).json({ status: 'error', message: 'La transacción no fue autorizada', response });
    }
  } catch (error) {
    console.error('Error confirmando la transacción:', error.message);
    res.status(500).json({ message: 'Error al confirmar el pago', error: error.message });
  } finally {
    activeTokens.delete(token_ws); // Limpieza del token
  }
});

module.exports = router;
