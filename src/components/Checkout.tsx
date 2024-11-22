import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { PaymentMethod, DeliveryMethod, OrderDetails } from '../types';
import { WebpayMallPayment } from './WebpayMallPayment';
import { formatCLP } from '../utils/currency';
import { Receipt, MapPin, Package2 } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { state, dispatch } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [address, setAddress] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showVoucher, setShowVoucher] = useState(false);

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
    setShowVoucher(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      const newOrderId = `ORDER-${Date.now()}`;
      setOrderId(newOrderId);
    } else if (paymentMethod === 'cash') {
      setShowVoucher(true);
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
  const currentDate = new Date().toLocaleDateString('es-CL');
  const orderNumber = `ORD-${Date.now()}`;

  // Prepare items for Webpay Mall transaction
  const mallItems = state.items.map((item) => ({
    amount: Math.round(item.price * item.quantity),
    storeIndex: 0, // All items go to store 1 in this example
  }));

  if (showVoucher) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="max-w-2xl mx-auto">
          <div className="border-b pb-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Voucher de Pago</h2>
            </div>
            <button
              onClick={() => window.print()}
              className="text-blue-600 hover:text-blue-800"
            >
              Imprimir
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Fecha: {currentDate}</span>
              <span>Orden: {orderNumber}</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Dirección de retiro:</p>
                  <p className="text-gray-600">{storeAddress}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Detalle de productos</h3>
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-4">
                    <Package2 className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.quantity} x {formatCLP(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium">
                    {formatCLP(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total a pagar:</span>
                <span>{formatCLP(state.total)}</span>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>Presente este voucher al momento de retirar y pagar su pedido</p>
              <p>Válido por 24 horas</p>
            </div>

            <button
              onClick={() => {
                dispatch({ type: 'CLEAR_CART' });
                setShowVoucher(false);
              }}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <span>{formatCLP(state.total)}</span>
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