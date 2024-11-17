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
  message?: string; // Mensaje de error desde el backend
}

export const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<PaymentResponse | null>(null);
  const [isRequesting, setIsRequesting] = useState(false); // Previene duplicados

  useEffect(() => {
    const confirmPayment = async () => {
      const token = searchParams.get('token_ws');
    
      if (!token) {
        setStatus('error');
        setPaymentDetails({ message: 'Token de transacción no encontrado.' });
        return;
      }
    
      if (isRequesting) return; // Evita llamadas repetitivas
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
        console.error('Error confirmando el pago:', error);
        setStatus('error');
        setPaymentDetails({ message: error.message || 'Error desconocido al procesar el pago.' });
      } finally {
        setIsRequesting(false);
      }
    };
  
    confirmPayment();
  }, [searchParams, dispatch, isRequesting]);
     
  
  

  const getPaymentTypeLabel = (code: string | undefined) => {
    const types: Record<string, string> = {
      VD: 'Débito',
      VN: 'Crédito',
      VC: 'Crédito',
      SI: 'Crédito',
      S2: 'Crédito',
      NC: 'Crédito',
    };
    return code ? types[code] || code : 'Desconocido';
  };

  const formatTransactionDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Fecha no válida' : date.toLocaleString();
  };

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

            <div className="mb-6 text-left space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><span className="font-semibold">Orden:</span> {paymentDetails.buyOrder || 'No disponible'}</p>
                <p><span className="font-semibold">Monto:</span> ${paymentDetails.amount?.toLocaleString() || 'No disponible'}</p>
                <p><span className="font-semibold">Fecha:</span> {formatTransactionDate(paymentDetails.transactionDate)}</p>
                <p><span className="font-semibold">Código Autorización:</span> {paymentDetails.authorizationCode || 'No disponible'}</p>
                {paymentDetails.cardDetail?.card_number && (
                  <p><span className="font-semibold">Tarjeta:</span> **** **** **** {paymentDetails.cardDetail.card_number}</p>
                )}
                <p><span className="font-semibold">Tipo de Pago:</span> {getPaymentTypeLabel(paymentDetails.paymentTypeCode)}</p>
                {paymentDetails.installmentsNumber && (
                  <p><span className="font-semibold">Cuotas:</span> {paymentDetails.installmentsNumber}</p>
                )}
              </div>

              {paymentDetails.vci && (
                <div className="flex items-start gap-2 bg-blue-50 p-4 rounded-lg">
                  <AlertCircle className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-blue-700">Estado de Autenticación</p>
                    <p className="text-blue-600">{paymentDetails.vci.message}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.print()}
                className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Imprimir Comprobante
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Volver a la tienda
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <XCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error en el pago</h2>
            <p className="mb-6">{paymentDetails?.message || 'Hubo un problema al procesar tu pago.'}</p>
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
