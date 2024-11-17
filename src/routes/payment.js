const express = require('express');
const { WebpayPlus, Environment } = require('transbank-sdk');
const dotenv = require('dotenv');
const redis = require('redis');

dotenv.config();

const router = express.Router();

// Configuración de Webpay Plus
const webpayPlus = new WebpayPlus.Transaction({
  commerceCode: process.env.TRANSBANK_STORE_CODE,
  apiKey: process.env.TRANSBANK_API_KEY,
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Integration,
});

// Configuración de Redis
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

// Ruta para crear transacciones
router.post('/create', async (req, res) => {
  const { buyOrder, sessionId, amount, returnUrl } = req.body;

  if (!buyOrder || !sessionId || !amount || !returnUrl) {
    return res.status(400).json({ message: 'Faltan parámetros para crear la transacción.' });
  }

  try {
    const response = await webpayPlus.create(buyOrder, sessionId, amount, returnUrl);
    console.log('Transacción creada con éxito:', response);
    res.status(200).json({ status: 'success', response });
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    res.status(500).json({ message: 'Error al crear la transacción.', error: error.message });
  }
});

// Ruta para confirmar transacciones
router.post('/confirm', async (req, res) => {
  const { token_ws } = req.body;

  if (!token_ws) {
    return res.status(400).json({ message: 'Token de transacción faltante' });
}

try {
    // Verifica si el token está en proceso
    const isProcessing = await client.get(token_ws);

    if (isProcessing) {
        console.log(`Token ${token_ws} ya está en proceso.`);
        return res.status(409).json({ message: 'La transacción ya está siendo procesada.' });
    }

    // Marca el token como en proceso
    await client.set(token_ws, 'processing', { EX: 300 });

    // Realiza la confirmación con Webpay
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
    if (error.message.includes('Transaction already locked')) {
        return res.status(409).json({ message: 'La transacción ya está siendo procesada por otro proceso.' });
    }
    res.status(500).json({ message: 'Error al confirmar el pago', error: error.message });
} finally {
    // Asegura que el token se desbloquee incluso en caso de error
    await client.del(token_ws);
}

});

module.exports = router;
