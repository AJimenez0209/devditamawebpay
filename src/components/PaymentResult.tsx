import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface PaymentResponse {
  vci: {
    code: string;
    message: string;
  };
  amount: number;
  status: string;
  buyOrder: string;
  sessionId: string;
  cardDetail?: {
    card_number: string;
  };
  transactionDate: string;
  authorizationCode: string;
  paymentTypeCode: string;
  responseCode: number;
  installmentsNumber?: number;
}

interface ErrorResponse {
  message: string;
}

export const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null); // Nuevo estado para errores
  const [isRequesting, setIsRequesting] = useState(false); // Previene solicitudes duplicadas

  useEffect(() => {
    const confirmPayment = async () => {
      const token = searchParams.get('token_ws');

      if (!token) {
        setStatus('error');
        setError({ message: 'Token de transacción no encontrado.' });
        return;
      }

      if (isRequesting) return;
      setIsRequesting(true);

      try {
        const apiBaseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
        const response = await fetch(`${apiBaseUrl}/api/payment/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token_ws: token }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al confirmar el pago');
        }

        const data = await response.json();

        if (data.status === 'success') {
          setStatus('success');
          setPaymentDetails(data.response);
          dispatch({ type: 'CLEAR_CART' });
        } else {
          throw new Error(data.message || 'Error en el pago');
        }
      } catch (error: any) {
        setStatus('error');
        setError({ message: error.message || 'Error desconocido' });
      } finally {
        setIsRequesting(false);
      }
    };

    confirmPayment();
  }, [searchParams, dispatch, isRequesting]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4" size={48} />
            <p className="text-lg">Procesando pago...</p>
          </div>
        )}

        {status === 'success' && paymentDetails && (
          <div className="text-center">
            <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-green-600 mb-4">¡Pago Exitoso!</h2>
            {/* Renderiza los detalles del pago */}
          </div>
        )}

        {status === 'error' && error && (
          <div className="text-center">
            <XCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error en el pago</h2>
            <p className="mb-6">{error.message}</p>
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

