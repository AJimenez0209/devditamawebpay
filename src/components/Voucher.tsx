import React from 'react';
import { CartItem } from '../types';
import { formatCLP } from '../utils/currency';

interface VoucherProps {
  items: CartItem[];
  total: number;
  storeAddress: string;
}

export const Voucher: React.FC<VoucherProps> = ({ items, total, storeAddress }) => {
  const currentDate = new Date().toLocaleDateString('es-CL');
  const orderNumber = `ORD-${Date.now()}`;

  return (
    <div className="print:m-0 print:p-0 print:shadow-none">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">BabyDiapers</h1>
        <p className="text-sm text-gray-600">Voucher de Pago</p>
      </div>

      <div className="flex justify-between text-sm text-gray-600 mb-6">
        <span>Fecha: {currentDate}</span>
        <span>Orden: {orderNumber}</span>
      </div>

      <div className="bg-white p-4 rounded-lg space-y-2 mb-6">
        <div>
          <p className="font-medium">Dirección de retiro:</p>
          <p className="text-gray-600">{storeAddress}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-lg">Detalle de productos</h3>
        {items.map((item: CartItem) => (

          <div key={item._id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                Cantidad: {item.quantity} x {formatCLP(item.prices[item.size])
                }
              </p>
            </div>
            <span className="font-medium">
            {formatCLP(item.prices[item.size] * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between text-xl font-bold">
          <span>Total a pagar:</span>
          <span>{formatCLP(total)}</span>
        </div>
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>Presente este voucher al momento de retirar y pagar su pedido</p>
        <p>Válido por 24 horas</p>
      </div>
    </div>
  );
};