const { Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } = require('transbank-sdk');

// Seleccionar el entorno (producción o integración) según la variable de entorno NODE_ENV
const environment = process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Integration;

const transbankConfig = {
  mall: new Options(
    process.env.NODE_ENV === 'production' ? process.env.TRANSBANK_MALL_CODE : IntegrationCommerceCodes.WEBPAY_PLUS_MALL,
    process.env.NODE_ENV === 'production' ? process.env.TRANSBANK_API_KEY : IntegrationApiKeys.WEBPAY,
    environment
  ),
  stores: [
    {
      commerceCode: process.env.NODE_ENV === 'production' ? process.env.TRANSBANK_STORE_1_CODE : '597055555536',
      name: 'Tienda 1'
    },
    {
      commerceCode: process.env.NODE_ENV === 'production' ? process.env.TRANSBANK_STORE_2_CODE : '597055555537',
      name: 'Tienda 2'
    }
  ]
};

module.exports = { transbankConfig };
