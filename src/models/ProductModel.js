import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },

  prices: {
    type: Map,
    of: Number,
    default: {},
  },
  unitsPerPack: {
    type: Map,
    of: Number,
    default: {},
  },
  stock: {
    type: Map,
    of: Number,
    default: {},
  },

  category: { type: String, default: 'pañales' },
  brand: { type: String, default: 'Marca genérica' },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
