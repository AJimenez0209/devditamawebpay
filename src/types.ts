export type Size = 'RN' | 'P' | 'M' | 'G' | 'XG' | 'XXG' | 'XXXG';

export interface BaseProduct {
  name: string;
  image: string;
  description: string;
  prices: { [key in Size]: number };
  unitsPerPack: { [key in Size]: number };
  stock: { [key in Size]: number };
  brand: string;
  category: string;
  isFeatured: boolean;
}

export interface Product extends BaseProduct {
  _id: string;
  sizes: string[];
}


export interface CartItem extends Product {
  quantity: number;
  size: Size; // ✅ ← Esta es la clave para resolver los errores
  unitsInPack?: number;
  formattedPrice: string;
}


export type PaymentMethod = 'cash' | 'card' | 'transfer';
export type DeliveryMethod = 'pickup' | 'delivery';

export interface OrderDetails {
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  address?: string;
  total: number;
}
