export type Size = 'RN' | 'P' | 'M' | 'G' | 'XG' | 'XXG' | 'XXXG';

export interface Product {
  id: string;
  baseId: string;
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