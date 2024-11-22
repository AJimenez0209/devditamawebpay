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

router.post('/status', async (req, res) => {
  const { token_ws } = req.body;

  if (!token_ws) {
    return res.status(400).json({ message: 'Token de transacción faltante' });
  }

  try {
    const statusResponse = await webpayPlus.status(token_ws);
    res.json({
      status: 'success',
      response: statusResponse,
    });
  } catch (error) {
    console.error('Error consultando el estado del token:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al consultar el estado del token.',
      error: error.message,
    });
  }
});


router.post('/confirm', async (req, res) => {
  const { token_ws } = req.body;

  if (!token_ws) {
    return res.status(400).json({ message: 'Token de transacción faltante' });
  }

  try {
    // Recuperar estado del token en Redis.
    const tokenData = await client.get(token_ws);
    const tokenStatus = tokenData ? JSON.parse(tokenData).status : null;

    if (tokenStatus === 'confirmed') {
      console.log(`Token ${token_ws} ya fue confirmado.`);
      return res.status(200).json({
        status: 'success',
        message: 'La transacción ya fue confirmada previamente.',
      });
    }

    if (tokenStatus === 'processing') {
      console.log(`Token ${token_ws} ya está en proceso.`);
      return res.status(409).json({ message: 'La transacción está en proceso.' });
    }

    // Establecer token como "processing".
    await client.set(
      token_ws,
      JSON.stringify({ status: 'processing' }),
      { NX: true, EX: 300 } // Expiración de 300s.
    );

    // Confirmar transacción con Webpay.
    const response = await webpayPlus.commit(token_ws);

    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      console.log('Transacción confirmada con éxito:', response);

      // Actualizar estado del token a "confirmed".
      await client.set(token_ws, JSON.stringify({ status: 'confirmed' }), { EX: 3600 });
      return res.json({ status: 'success', response });
    } else {
      console.error('Error en la transacción:', response);

      // Eliminar token si no se confirma.
      await client.del(token_ws);
      return res.status(400).json({
        status: 'error',
        message: 'La transacción no fue autorizada',
        response,
      });
    }
  } catch (error) {
    console.error('Error confirmando la transacción:', error);

    // Eliminar token en caso de error inesperado.
    await client.del(token_ws);
    return res.status(500).json({
      status: 'error',
      message: 'Error al confirmar el pago',
      error: error.message,
    });
  }
});



module.exports = router;
