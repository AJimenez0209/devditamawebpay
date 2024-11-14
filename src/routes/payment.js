const express = require('express');
const { WebpayPlus, TransactionDetail } = require('transbank-sdk');
const { transbankConfig } = require('../config/transbank');
const { validateMallTransaction } = require('../middleware/validateTransaction');

const router = express.Router();

router.post('/mall/create', async (req, res) => {
  try {
    const { orderId, items } = req.body;

    // Validación de parámetros
    if (!orderId || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Parámetros de transacción faltantes o incorrectos' });
    }

    // Transformación de los parámetros para el SDK de Transbank
    const buyOrder = orderId.toString();  // Usa `orderId` como `buyOrder` y asegúrate de que sea string
    const sessionId = `SESSION-${Date.now().toString()}`;  // Genera un sessionId único como string

    // Transforma `items` en el formato esperado `details`
    const details = items.map((item, index) => ({
      commerceCode: '597012345678',  // Código del comercio
      buyOrder: `${orderId}-${index}`.toString(),  // Genera un buyOrder único para cada transacción y asegura que sea string
      amount: item.amount
    }));

    const tx = new WebpayPlus.MallTransaction(transbankConfig.mall);
    const response = await tx.create(buyOrder, sessionId, details, transbankConfig.returnUrl);

    res.json({
      status: 'success',
      response: response,
    });
  } catch (error) {
    console.error('Error creating mall transaction:', error);
    res.status(500).json({
      message: 'Error al crear la transacción',
      error: error.message,
    });
  }
});


// Confirmar transacción mall
router.post('/mall/confirm', async (req, res) => {
  try {
    const { token_ws } = req.body;

    if (!token_ws) {
      return res.status(400).json({ message: 'Token de transacción faltante' });
    }

    const tx = new WebpayPlus.MallTransaction(transbankConfig.mall);
    const response = await tx.commit(token_ws);

    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      res.json({
        status: 'success',
        response: response,
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'La transacción no fue autorizada',
        response: response,
      });
    }
  } catch (error) {
    console.error('Error confirming mall transaction:', error);
    res.status(500).json({
      message: 'Error al confirmar el pago',
      error: error.message,
    });
  }
});

module.exports = router;
