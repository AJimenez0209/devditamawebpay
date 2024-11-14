export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  size: string;
  quantity: number;
  unitsPerPack: number;
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