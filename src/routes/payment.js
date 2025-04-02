const express = require('express');
const { WebpayPlus, Environment } = require('transbank-sdk');
const dotenv = require('dotenv');
const redis = require('redis');
const Transaction = require('../models/Transaction'); // Asegúrate de que la ruta sea correcta

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
    tls: false, // Activar conexión TLS o false si es local
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


// Ruta para confirmar transacciones
router.post('/confirm', async (req, res) => {
  const { token_ws } = req.body;

  if (!token_ws) {
    return res.status(400).json({ message: 'Token de transacción faltante' });
  }

  try {
    // Revisar si el token ya está confirmado
    const tokenStatus = await client.get(token_ws);

    if (tokenStatus === 'confirmed') {
      console.log(`Token ${token_ws} ya fue confirmado.`);
      return res.status(200).json({ status: 'success', message: 'La transacción ya fue confirmada previamente.' });
    }

    if (tokenStatus === 'processing') {
      console.log(`Token ${token_ws} ya está en proceso.`);
      return res.status(409).json({ status: 'processing', message: 'La transacción está siendo procesada.' });
    }

    // Bloquea el token como "en proceso"
    const setProcessing = await client.set(token_ws, 'processing', { NX: true, EX: 60 });

    if (!setProcessing) {
      console.log(`Token ${token_ws} ya está en proceso por otro flujo.`);
      return res.status(409).json({ status: 'processing', message: 'La transacción está siendo procesada.' });
    }

    // Confirmar transacción con Webpay
    const response = await webpayPlus.commit(token_ws);

    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      console.log('Transacción confirmada con éxito:', response);

      // Guardar en MongoDB
      await Transaction.create(response); // Asegúrate de que el modelo Transaction esté importado correctamente
      console.log('Transacción guardada en MongoDB:', response);

      // Marca como "confirmado"
      await client.set(token_ws, 'confirmed', { EX: 3600 });
      const toCamelCase = (data) => ({
        amount: data.amount,
        status: data.status,
        buyOrder: data.buy_order,
        sessionId: data.session_id,
        cardDetail: data.card_detail,
        transactionDate: data.transaction_date,
        authorizationCode: data.authorization_code,
        paymentTypeCode: data.payment_type_code,
        responseCode: data.response_code,
        installmentsNumber: data.installments_number,
        message: data.message,
      });

      return res.status(200).json({
        status: 'success',
        response: toCamelCase(response),
      });

    } else {
      console.error('Error en la confirmación:', response);
      await client.del(token_ws); // Elimina el lock en caso de error
      return res.status(400).json({ status: 'error', message: 'La transacción no fue autorizada', response });
    }
  } catch (error) {
    console.error('Error confirmando la transacción:', error);
    await client.del(token_ws); // Libera el lock en caso de error
    return res.status(500).json({ status: 'error', message: 'Error interno al confirmar la transacción', error: error.message });
  }

});




module.exports = router;
