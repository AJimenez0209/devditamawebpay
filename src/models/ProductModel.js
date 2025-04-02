import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  prices: {
    RN: Number,
    P: Number,
    M: Number,
    G: Number,
    XG: Number,
    XXG: Number,
    XXXG: Number
  },
  unitsPerPack: {
    RN: Number,
    P: Number,
    M: Number,
    G: Number,
    XG: Number,
    XXG: Number,
    XXXG: Number
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
