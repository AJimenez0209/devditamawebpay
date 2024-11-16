import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface TransactionDetail {
  amount: number;
  status: string;
  authorizationCode: string;
  paymentTypeCode: string;
  responseCode: number;
  installmentsNumber: number;
  commerceCode: string;
  buyOrder: string;
}

interface PaymentResponse {
  vci: {
    code: string;
    message: string;
  };
  details: TransactionDetail[];
  cardDetail?: {
    card_number: string;
  };
  accountingDate: string;
  transactionDate: string;
}

export const MallPaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<PaymentResponse | null>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const token = searchParams.get('token_ws');
      
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token_ws: token }),
        });

        if (!response.ok) {
          throw new Error('Error al confirmar el pago');
        }

        const data = await response.json();
        
        if (data.status === 'success') {
          setStatus('success');
          setPaymentDetails(data.response);
          dispatch({ type: 'CLEAR_CART' });
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error confirming payment:', error);
        setStatus('error');
      }
    };

    confirmPayment();
  }, [searchParams, dispatch]);

  const getPaymentTypeLabel = (code: string) => {
    const types: Record<string, string> = {
      VD: 'Débito',
      VN: 'Crédito',
      VC: 'Crédito',
      SI: '3 cuotas sin interés',
      S2: '2 cuotas sin interés',
      NC: 'N cuotas sin interés',
      VP: 'Prepago',
    };
    return types[code] || code;
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
              {paymentDetails.details.map((detail, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Transacción {index + 1}
                  </h3>
                  <p><span className="font-semibold">Orden:</span> {detail.buyOrder}</p>
                  <p><span className="font-semibold">Monto:</span> ${detail.amount.toLocaleString()}</p>
                  <p><span className="font-semibold">Código Autorización:</span> {detail.authorizationCode}</p>
                  <p><span className="font-semibold">Tipo de Pago:</span> {getPaymentTypeLabel(detail.paymentTypeCode)}</p>
                  {detail.installmentsNumber > 0 && (
                    <p><span className="font-semibold">Cuotas:</span> {detail.installmentsNumber}</p>
                  )}
                </div>
              ))}

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><span className="font-semibold">Fecha:</span> {new Date(paymentDetails.transactionDate).toLocaleString()}</p>
                {paymentDetails.cardDetail?.card_number && (
                  <p><span className="font-semibold">Tarjeta:</span> **** **** **** {paymentDetails.cardDetail.card_number}</p>
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
            <p className="mb-6">Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.</p>
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