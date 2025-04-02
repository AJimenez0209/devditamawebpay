import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../src/models/ProductModel.js';

dotenv.config();

const products = [
  {
    name: 'Pañales Premium Clásicos',
    image: 'https://www.maicao.cl/dw/image/v2/BDPM_PRD/on/demandware.static/-/Sites-masterCatalog_Chile/default/dw22f98a25/images/large/293133-pampers-panal-36-unidades.jpg?sw=1000&sh=1000',
    description: 'Pañales ultra suaves con máxima absorción',
    prices: {
      RN: 15990,
      P: 17990,
      M: 19990,
      G: 21990,
      XG: 23990,
      XXG: 25990,
      XXXG: 27990
    },
    unitsPerPack: {
      RN: 36,
      P: 40,
      M: 44,
      G: 40,
      XG: 36,
      XXG: 34,
      XXXG: 32
    }
  },
  {
    name: 'Pañales Premium Hipoalergénicos',
    image: 'https://dojiw2m9tvv09.cloudfront.net/71536/product/X_babysec-super-premium-xxg4128.png?40&time=1732588659',
    description: 'Especialmente diseñados para pieles sensibles',
    prices: {
      RN: 16990,
      P: 18990,
      M: 20990,
      G: 22990,
      XG: 24990,
      XXG: 26990,
      XXXG: 28990
    },
    unitsPerPack: {
      RN: 34,
      P: 38,
      M: 42,
      G: 38,
      XG: 34,
      XXG: 32,
      XXXG: 30
    }
  },
  {
    name: 'Pañales Ecológicos Biodegradables',
    image: 'https://xn--ecopaal-8za.cl/wp-content/uploads/2024/01/Panal-Ecologico-Nateen-L-128-unidades-600x600.png',
    description: 'Amigables con el medio ambiente y la piel del bebé',
    prices: {
      RN: 17990,
      P: 19990,
      M: 21990,
      G: 23990,
      XG: 25990,
      XXG: 27990,
      XXXG: 29990
    },
    unitsPerPack: {
      RN: 32,
      P: 36,
      M: 40,
      G: 36,
      XG: 32,
      XXG: 30,
      XXXG: 28
    }
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    const createdProducts = await Product.insertMany(products);
    console.log('Productos insertados correctamente');
    process.exit();
  } catch (error) {
    console.error('Error al insertar productos:', error);
    process.exit(1);
  }
};

seedProducts();
