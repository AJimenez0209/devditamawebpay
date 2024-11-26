export type Size = 'RN' | 'P' | 'M' | 'G' | 'XG' | 'XXG' | 'XXXG';

export interface BaseProduct {
  id: string;
  name: string;
  image: string;
  description: string;
  prices: Record<Size, number>;
  unitsPerPack: Record<Size, number>;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  size: Size;
  quantity: number;
  unitsPerPack: number;
  formattedPrice: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type PaymentMethod = 'cash' | 'card' | 'transfer';
export type DeliveryMethod = 'pickup' | 'delivery';

export interface OrderDetails {
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  address?: string;
  total: number;
}