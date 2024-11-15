const { Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys, WebpayPlus } = require('transbank-sdk');

// Seleccionar el entorno (producción o integración) según la variable de entorno NODE_ENV
const environment = process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Integration;

// Configuración para Webpay Plus en una tienda individual
const transbankConfig = new Options(
  process.env.NODE_ENV === 'production' ? process.env.TRANSBANK_STORE_CODE : IntegrationCommerceCodes.WEBPAY_PLUS,
  process.env.NODE_ENV === 'production' ? process.env.TRANSBANK_API_KEY : IntegrationApiKeys.WEBPAY,
  environment
);

module.exports = { transbankConfig };
