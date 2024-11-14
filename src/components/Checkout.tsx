import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { PaymentMethod, DeliveryMethod, OrderDetails } from '../types';
import { WebpayMallPayment } from './WebpayMallPayment';

export const Checkout: React.FC = () => {
  const { state, dispatch } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [address, setAddress] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (paymentMethod === 'cash' && deliveryMethod === 'delivery') {
      setDeliveryMethod('pickup');
    }
  }, [paymentMethod]);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === 'cash') {
      setDeliveryMethod('pickup');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      const newOrderId = `ORDER-${Date.now()}`;
      setOrderId(newOrderId);
    } else {
      const orderDetails: OrderDetails = {
        paymentMethod,
        deliveryMethod,
        address: deliveryMethod === 'delivery' ? address : undefined,
        total: state.total,
      };
      console.log('Order placed:', orderDetails);
      dispatch({ type: 'CLEAR_CART' });
      alert('¡Pedido realizado con éxito!');
    }
  };

  const storeAddress = "Av. Principal 123, Local 45";

  // Prepare items for Webpay Mall transaction
  const mallItems = state.items.map((item) => ({
    amount: Math.round(item.price * item.quantity),
    storeIndex: 0, // All items go to store 1 in this example
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Finalizar Compra</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Método de Pago</h3>
          <div className="space-y-2">
            {[
              { value: 'cash', label: 'Efectivo' },
              { value: 'card', label: 'Tarjeta (Webpay)' },
              { value: 'transfer', label: 'Transferencia' },
            ].map((method) => (
              <label key={method.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={(e) => handlePaymentMethodChange(e.target.value as PaymentMethod)}
                  className="text-blue-600"
                />
                <span>{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Método de Entrega</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="delivery"
                value="pickup"
                checked={deliveryMethod === 'pickup'}
                onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                className="text-blue-600"
              />
              <span>Retiro en local</span>
            </label>
            {paymentMethod !== 'cash' && (
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="delivery"
                  value="delivery"
                  checked={deliveryMethod === 'delivery'}
                  onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                  className="text-blue-600"
                />
                <span>Envío a domicilio</span>
              </label>
            )}
          </div>
          {deliveryMethod === 'pickup' && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Dirección de retiro:</span><br />
                {storeAddress}
              </p>
            </div>
          )}
        </div>

        {deliveryMethod === 'delivery' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección de envío
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                required
              />
            </label>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Total:</span>
            <span>${state.total.toFixed(2)}</span>
          </div>
          {orderId && paymentMethod === 'card' ? (
            <WebpayMallPayment orderId={orderId} items={mallItems} />
          ) : (
            <button
              type="submit"
              disabled={state.items.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {paymentMethod === 'card' ? 'Continuar al pago' : 'Confirmar Pedido'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};