import mongoose from 'mongoose';

const sizeTypes = ['RN', 'P', 'M', 'G', 'XG', 'XXG', 'XXXG'];

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },

  // Precios por talla
  prices: {
    RN: Number,
    P: Number,
    M: Number,
    G: Number,
    XG: Number,
    XXG: Number,
    XXXG: Number,
  },

  // Unidades por paquete por talla
  unitsPerPack: {
    RN: Number,
    P: Number,
    M: Number,
    G: Number,
    XG: Number,
    XXG: Number,
    XXXG: Number,
  },

  // Stock por talla
  stock: {
    RN: { type: Number, default: 0 },
    P: { type: Number, default: 0 },
    M: { type: Number, default: 0 },
    G: { type: Number, default: 0 },
    XG: { type: Number, default: 0 },
    XXG: { type: Number, default: 0 },
    XXXG: { type: Number, default: 0 },
  },

  // Nuevos campos
  category: { type: String, default: 'pañales' },
  brand: { type: String, default: 'Marca genérica' },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true }); // crea createdAt y updatedAt automáticamente

const Product = mongoose.model('Product', productSchema);

export default Product;
