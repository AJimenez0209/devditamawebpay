import express from 'express';
import dotenv from 'dotenv';
import redis from 'redis';
import Transaction from '../models/Transaction.js'; // Asegúrate de que también esté en formato ES Module
import pkg from 'transbank-sdk';
const { WebpayPlus, Environment } = pkg;


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
    tls: false,
    rejectUnauthorized: false,
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

// Ruta para consultar estado de la transacción
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
    const tokenStatus = await client.get(token_ws);

    if (tokenStatus === 'confirmed') {
      console.log(`Token ${token_ws} ya fue confirmado.`);
      return res.status(200).json({ status: 'success', message: 'La transacción ya fue confirmada previamente.' });
    }

    if (tokenStatus === 'processing') {
      console.log(`Token ${token_ws} ya está en proceso.`);
      return res.status(409).json({ status: 'processing', message: 'La transacción está siendo procesada.' });
    }

    const setProcessing = await client.set(token_ws, 'processing', { NX: true, EX: 60 });

    if (!setProcessing) {
      console.log(`Token ${token_ws} ya está en proceso por otro flujo.`);
      return res.status(409).json({ status: 'processing', message: 'La transacción está siendo procesada.' });
    }

    const response = await webpayPlus.commit(token_ws);

    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      console.log('Transacción confirmada con éxito:', response);

      await Transaction.create(response);
      console.log('Transacción guardada en MongoDB:', response);

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
      await client.del(token_ws);
      return res.status(400).json({ status: 'error', message: 'La transacción no fue autorizada', response });
    }
  } catch (error) {
    console.error('Error confirmando la transacción:', error);
    await client.del(token_ws);
    return res.status(500).json({ status: 'error', message: 'Error interno al confirmar la transacción', error: error.message });
  }
});

export default router;
