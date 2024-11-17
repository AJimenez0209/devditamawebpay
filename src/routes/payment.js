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

const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true, // Activar conexión TLS
    rejectUnauthorized: false, // Permitir certificados autofirmados
  },
});

client.connect();

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

module.exports = client;


router.post('/confirm', async (req, res) => {
  const { token_ws } = req.body;

  if (!token_ws) {
    return res.status(400).json({ message: 'Token de transacción faltante' });
  }

  try {
    // Verifica si el token ya está siendo procesado
    const isProcessing = await client.get(token_ws);

    if (isProcessing) {
      console.log(`Token ${token_ws} ya está en proceso.`);
      return res.status(409).json({ message: 'La transacción ya está siendo procesada.' });
    }

    // Marca el token como en proceso (expira en 5 minutos)
    await client.set(token_ws, 'processing', { EX: 300 });

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
    // Elimina el token del almacenamiento después de confirmar
    await client.del(token_ws);
  }
});



router.post('/confirm', async (req, res) => {
  const { token_ws } = req.body;

  if (!token_ws) {
    return res.status(400).json({ message: 'Token de transacción faltante' });
  }

  // Rechaza solicitudes duplicadas si ya está en proceso
  if (activeTokens.has(token_ws)) {
    console.log(`Token ${token_ws} ya está en proceso.`);
    return res.json({ status: 'in-progress', message: 'La transacción ya está siendo procesada.' });
  }

  // Marca el token como en proceso
  activeTokens.set(token_ws, true);

  try {
    const response = await webpayPlus.commit(token_ws);

    if (response.response_code === 0 && response.status === 'AUTHORIZED') {
      console.log('Transacción confirmada con éxito:', response);

      // Libera el token inmediatamente después del éxito
      activeTokens.delete(token_ws);
      return res.json({ status: 'success', response });
    } else {
      console.error('Error en la transacción:', response);

      // Libera el token en caso de error
      activeTokens.delete(token_ws);
      return res.status(400).json({
        status: 'error',
        message: 'La transacción no fue autorizada.',
        response,
      });
    }
  } catch (error) {
    console.error('Error confirmando la transacción:', error);

    // Libera el token en caso de excepción
    activeTokens.delete(token_ws);
    return res.status(500).json({
      status: 'error',
      message: 'Error al confirmar la transacción.',
      error: error.message,
    });
  }
});



module.exports = router;
