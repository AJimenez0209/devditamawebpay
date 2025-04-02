export type Size = 'RN' | 'P' | 'M' | 'G' | 'XG' | 'XXG' | 'XXXG';

export interface BaseProduct {
  name: string;
  image: string;
  description: string;
  prices: { [key in Size]: number };
  unitsPerPack?: { [key in Size]: number };
}

export interface Product extends BaseProduct {
  _id: string;
  stock?: number;
}
export interface CartItem extends Product {
  quantity: number;
  unitsInPack?: number; // <- este es el nuevo campo
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