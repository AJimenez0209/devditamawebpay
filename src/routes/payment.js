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
    return res.status(400).json({ message: 'Token de transacción faltante' });
  }

  console.log(`Confirmando transacción con token: ${token_ws}`);

  // Evita solicitudes duplicadas
  if (activeTokens.has(token_ws)) {
    console.log(`Token ${token_ws} ya está en proceso.`);
    return res.status(409).json({ message: 'La transacción ya está siendo procesada.' });
  }

  // Marca el token como en proceso
  activeTokens.add(token_ws);

  try {
    const response = await webpayPlus.commit(token_ws);

    // Validar el estado de la respuesta
    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      console.log("Transacción confirmada con éxito:", response);
      return res.json({
        status: 'success',
        response: {
          buyOrder: response.buy_order || 'No disponible',
          sessionId: response.session_id || 'No disponible',
          amount: response.amount || 0,
          transactionDate: response.transaction_date || null,
          authorizationCode: response.authorization_code || 'No disponible',
          paymentTypeCode: response.payment_type_code || 'Desconocido',
          installmentsNumber: response.installments_number || 0,
          cardDetail: response.card_detail || { card_number: '****' },
        },
      });
    } else {
      console.error("Error en la confirmación de la transacción:", response);
      return res.status(400).json({ message: 'La transacción no fue autorizada.', response });
    }
  } catch (error) {
    console.error('Error procesando la transacción:', error);
    return res.status(500).json({ message: 'Error interno al confirmar el pago', error: error.message });
  } finally {
    // Libera el token del Set
    activeTokens.delete(token_ws);
  }
});


module.exports = router;
