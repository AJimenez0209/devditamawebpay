import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface PaymentResponse {
  vci?: {
    code: string;
    message: string;
  };
  amount?: number;
  status?: string;
  buyOrder?: string;
  sessionId?: string;
  cardDetail?: {
    card_number: string;
  };
  
  transactionDate?: string;
  authorizationCode?: string;
  paymentTypeCode?: string;
  responseCode?: number;
  installmentsNumber?: number;
}

export const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<PaymentResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const token = searchParams.get('token_ws');
      if (!token) {
        setStatus('error');
        setErrorMessage('Token de transacción no encontrado.');
        return;
      }

      // Evita reintentos innecesarios si el token ya fue procesado
      if (sessionStorage.getItem(`processed_${token}`)) {
        console.log(`Token ${token} ya fue procesado.`);
        setStatus('success');
        setPaymentDetails(null); // Evita redundancia de detalles
        return;
      }

      try {
        const apiBaseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
        const response = await fetch(`${apiBaseUrl}/api/payment/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token_ws: token }),
        });

        const data = await response.json();

        if (response.status === 200 && data.status === 'success') {
          console.log('Transacción confirmada con éxito.');
          setStatus('success');
          setPaymentDetails(data.response || null);
          sessionStorage.setItem(`processed_${token}`, 'true'); // Marca como procesado
          dispatch({ type: 'CLEAR_CART' });
          return;
        }

        if (response.status === 409) {
          console.log('Transacción previamente confirmada.');
          setStatus('success');
          setPaymentDetails(null); // Evita mostrar detalles redundantes
          sessionStorage.setItem(`processed_${token}`, 'true');
          return;
        }

        throw new Error(data.message || 'Error al confirmar el pago');
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error.message || 'Error desconocido al procesar el pago.');
      }
    };

    confirmPayment();
  }, [searchParams, dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4" size={48} />
            <p className="text-lg">Procesando pago...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-green-600 mb-4">¡Pago Exitoso!</h2>
            {paymentDetails && (
              <div className="mb-6 text-left space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><span className="font-semibold">Orden:</span> {paymentDetails.buyOrder || 'No disponible'}</p>
                  <p><span className="font-semibold">Monto:</span> ${paymentDetails.amount?.toLocaleString() || 'No disponible'}</p>
                  <p><span className="font-semibold">Fecha:</span> {new Date(paymentDetails.transactionDate || '').toLocaleString()}</p>
                  <p><span className="font-semibold">Código Autorización:</span> {paymentDetails.authorizationCode || 'No disponible'}</p>
                  {paymentDetails.cardDetail?.card_number && (
                    <p><span className="font-semibold">Tarjeta:</span> **** **** **** {paymentDetails.cardDetail.card_number}</p>
                  )}
                  <p><span className="font-semibold">Tipo de Pago:</span> {paymentDetails.paymentTypeCode || 'Desconocido'}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver a la tienda
            </button>
          </div>
        )}

        {status === 'error' && errorMessage && (
          <div className="text-center">
            <XCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error en el pago</h2>
            <p className="mb-6">{errorMessage}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver a la tienda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
