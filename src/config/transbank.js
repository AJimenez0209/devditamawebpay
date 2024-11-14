//const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require('transbank-sdk');

//const transbankConfig = {
  //integration: {
    //mall: new Options(
      //IntegrationCommerceCodes.WEBPAY_PLUS_MALL,
      //IntegrationApiKeys.WEBPAY,
      //Environment.Integration
    //),
    //stores: [
      //{
      //  commerceCode: '597055555536',
       // name: 'Tienda 1'
      //},
      //{
       // commerceCode: '597055555537',
       // name: 'Tienda 2'
      //}
    //]
  //},
  //production: {
    //mall: new Options(
      //process.env.TRANSBANK_MALL_CODE,
      //process.env.TRANSBANK_API_KEY,
      //Environment.Production
    //),
    //stores: [
      //{
        //commerceCode: process.env.TRANSBANK_STORE_1_CODE,
        //name: 'Tienda 1'
      //},
      //{
        //commerceCode: process.env.TRANSBANK_STORE_2_CODE,
        //name: 'Tienda 2'
      //}
    //]
  //}
//};

//module.exports = { transbankConfig };

const { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } = require('transbank-sdk');

const transbankConfig = {
  integration: {
    mall: new Options(
      IntegrationCommerceCodes.WEBPAY_PLUS_MALL,
      IntegrationApiKeys.WEBPAY,
      Environment.Integration
    ),
    stores: [
      {
        commerceCode: '597055555536', // Ejemplo: Código de tienda 1 en integración
        name: 'Tienda 1'
      },
      {
        commerceCode: '597055555537', // Ejemplo: Código de tienda 2 en integración
        name: 'Tienda 2'
      }
    ]
  },
  production: {
    mall: new Options(
      process.env.TRANSBANK_MALL_CODE,
      process.env.TRANSBANK_API_KEY,
      Environment.Production
    ),
    stores: [
      {
        commerceCode: process.env.TRANSBANK_STORE_1_CODE,
        name: 'Tienda 1'
      },
      {
        commerceCode: process.env.TRANSBANK_STORE_2_CODE,
        name: 'Tienda 2'
      }
    ]
  }
};

module.exports = { transbankConfig };

