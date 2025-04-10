import { Size } from '../types';

export interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  isFeatured: boolean;
  prices: { [key in Size]: number };  // Importante
  unitsPerPack: { [key in Size]: number };
  stock: { [key in Size]: number };
  sizes: string[];
}

export const validateProduct = (data: any): Product => {
  return {
    _id: data._id,
    name: data.name,
    image: data.image,
    description: data.description,
    brand: data.brand,
    category: data.category,
    isFeatured: data.isFeatured,
    prices: data.prices as { [key in Size]: number },  // <-- Clave
    unitsPerPack: data.unitsPerPack as { [key in Size]: number },
    stock: data.stock as { [key in Size]: number },
    sizes: data.sizes || [],  // Si viene de la BD
  };
};

  