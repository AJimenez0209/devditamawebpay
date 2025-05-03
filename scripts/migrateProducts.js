import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../src/models/ProductModel.js';
dotenv.config();

const migrateProductData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    const products = await Product.find({});

    const sizeKeys = ['RN', 'P', 'M', 'G', 'XG', 'XXG', 'XXXG'];

    for (const product of products) {
      let updated = false;

      // Migrar prices
      if (!(product.prices instanceof Map)) {
        const newPrices = {};
        sizeKeys.forEach((size) => {
          if (product.prices?.[size] !== undefined) {
            newPrices[size] = product.prices[size];
            updated = true;
          }
        });
        product.prices = newPrices;
      }

      // Migrar stock
      if (!(product.stock instanceof Map)) {
        const newStock = {};
        sizeKeys.forEach((size) => {
          if (product.stock?.[size] !== undefined) {
            newStock[size] = product.stock[size];
            updated = true;
          }
        });
        product.stock = newStock;
      }

      // Migrar unitsPerPack
      if (!(product.unitsPerPack instanceof Map)) {
        const newUnits = {};
        sizeKeys.forEach((size) => {
          if (product.unitsPerPack?.[size] !== undefined) {
            newUnits[size] = product.unitsPerPack[size];
            updated = true;
          }
        });
        product.unitsPerPack = newUnits;
      }

      if (updated) {
        await product.save();
        console.log(`Producto migrado: ${product.name}`);
      }
    }

    console.log('✅ Migración completada.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en la migración:', err);
    process.exit(1);
  }
};

migrateProductData();
