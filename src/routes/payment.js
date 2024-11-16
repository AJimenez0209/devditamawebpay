const express = require('express');
const { WebpayPlus, Environment } = require('transbank-sdk');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Configuración de Webpay Plus
const webpayPlus = new WebpayPlus.Transaction({
  commerceCode: process.env.TRANSBANK_STORE_CODE,
  apiKey: process.env.TRANSBANK_API_KEY,
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Integration,
});

// Mapa para manejar el bloqueo temporal de tokens
const activeTokens = new Map();

router.post('/create', async (req, res) => {
  try {
    const { orderId, sessionId, amount } = req.body;

    if (!orderId || !sessionId || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Parámetros de transacción faltantes o incorrectos' });
    }

    const returnUrl = `${process.env.FRONTEND_URL}/payment/result`.replace(/([^:]\/)\/+/g, '$1');
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
    return res.status(400).json({ message: 'Token de transacción faltante' });
  }

  console.log(`Confirmando transacción con token: ${token_ws}`);

  // Rechaza solicitudes duplicadas
  if (activeTokens.has(token_ws)) {
    console.log(`Token ${token_ws} ya está en proceso.`);
    return res.status(409).json({ message: 'La transacción ya está siendo procesada.' });
  }

  // Marca el token como en proceso
  activeTokens.set(token_ws, true);

  try {
    const response = await webpayPlus.commit(token_ws);

    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      console.log('Transacción confirmada con éxito:', response);

      res.json({ status: 'success', response });
    } else {
      console.error('Error en la transacción:', response);
      res.status(400).json({ status: 'error', message: 'La transacción no fue autorizada', response });
    }
  } catch (error) {
    console.error('Error confirmando la transacción:', error);
    res.status(500).json({ message: 'Error al confirmar el pago', error: error.message });
  } finally {
    // Libera el token del Mapa después de un breve retardo para manejar solicitudes concurrentes
    setTimeout(() => {
      console.log(`Liberando token: ${token_ws}`);
      activeTokens.delete(token_ws);
    }, 3000); // 3 segundos de espera
  }
});

module.exports = router;
