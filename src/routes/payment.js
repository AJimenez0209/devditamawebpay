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

// Ruta para crear una transacción
router.post('/create', async (req, res) => {
  try {
    console.log("Request body recibido:", req.body); // Log detallado del request

    const { orderId, sessionId, amount } = req.body;

    // Verifica que los parámetros obligatorios estén presentes
    if (!orderId || !sessionId || !amount || isNaN(amount) || amount <= 0) {
      console.error('Parámetros de transacción faltantes o incorrectos:', { orderId, sessionId, amount });
      return res.status(400).json({ message: 'Parámetros de transacción faltantes o incorrectos' });
    }

    // Genera el returnUrl directamente en el backend
    const returnUrl = `${process.env.FRONTEND_URL}/payment/result`.replace(/([^:]\/)\/+/g, "$1");

    console.log("Generando transacción con los siguientes datos:", { orderId, sessionId, amount, returnUrl });

    // Crea la transacción
    const response = await webpayPlus.create(orderId.toString(), sessionId.toString(), amount, returnUrl);

    console.log("Respuesta de Webpay Plus:", response);

    res.json({ status: 'success', response });
  } catch (error) {
    console.error('Error creando la transacción:', error);

    // Verifica si el error proviene de Transbank
    if (error.response) {
      console.error('Error detallado de Transbank:', error.response.data);
    }

    res.status(500).json({
      message: 'Error al crear la transacción',
      error: error.message || 'Error desconocido',
    });
  }
});

const inProcessTransactions = new Set(); // Almacena los tokens en proceso

router.post('/confirm', async (req, res) => {
  try {
    const { token_ws } = req.body;

    if (!token_ws) {
      return res.status(400).json({ message: 'Token de transacción faltante' });
    }

    console.log(`Confirmando transacción con token: ${token_ws}`);

    // Verifica si el token ya está siendo procesado
    if (activeTokens.has(token_ws)) {
      console.warn(`Token ${token_ws} ya está en proceso.`);
      return res.status(409).json({ status: 'error', message: 'Transacción ya está siendo procesada.' });
    }

    // Marca el token como en proceso
    activeTokens.add(token_ws);

    const response = await webpayPlus.commit(token_ws);

    console.log('Respuesta de confirmación de Webpay Plus:', response);

    // Manejo de errores específicos de Transbank
    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      res.json({ status: 'success', response });
    } else {
      res.status(400).json({ status: 'error', message: 'La transacción no fue autorizada', response });
    }
  } catch (error) {
    console.error('Error confirmando la transacción:', error);
    res.status(500).json({ message: 'Error al confirmar el pago', error: error.message });
  } finally {
    // Libera el token al finalizar el proceso
    activeTokens.delete(token_ws);
  }
});



module.exports = router;
