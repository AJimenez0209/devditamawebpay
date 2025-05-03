import { Size } from '../types';

export interface Product {
  _id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  isFeatured: boolean;
  prices: { [key in Size]: number };
  unitsPerPack: { [key in Size]: number };
  stock: { [key in Size]: number };
  sizes: string[];
  image?: string; // Campo individual (opcional)
  images?: string[]; // Para mostrar en la tabla
  priceBySize?: { [key in Size]: number }; // Para el renderizado
}

export const validateProduct = (data: any): Product => {
  return {
    _id: data._id,
    name: data.name,
    description: data.description,
    brand: data.brand,
    category: data.category,
    isFeatured: data.isFeatured,
    prices: data.prices || {},
    unitsPerPack: data.unitsPerPack || {},
    stock: data.stock || {},
    sizes: Array.isArray(data.sizes) ? data.sizes : [],
    image: data.image || '',
    images: Array.isArray(data.images) ? data.images : (data.image ? [data.image] : []),
    priceBySize: data.prices || {}, // reutiliza `prices`
  };
};
