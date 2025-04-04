import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { WebpayRedirectForm } from './WebpayRedirectForm';

interface WebpayPlusPaymentProps {
  orderId: string;
  amount: number;
}

console.log('✅ Este es el PaymentResult.tsx correcto');


export const WebpayPlusPayment: React.FC<WebpayPlusPaymentProps> = ({ orderId, amount }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<{ token: string; url: string } | null>(null);

  const handleWebpayPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validar monto
      if (!amount || isNaN(amount) || amount <= 0) {
        throw new Error('El monto total es inválido.');
      }

      const sessionId = `SESSION-${Date.now()}`;
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyOrder: orderId,
          sessionId,
          amount,
          returnUrl: `${window.location.origin}/payment/result`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar el pago');
      }

      const data = await response.json();
      if (data.response?.url && data.response?.token) {
        setPaymentData({ token: data.response.token, url: data.response.url });
      } else {
        throw new Error('Respuesta inválida del servidor');
      }

    } catch (error: any) {
      console.error('Error al iniciar el pago:', error);
      setError(error.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (paymentData) {
    return <WebpayRedirectForm token={paymentData.token} url={paymentData.url} />;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      <button
        onClick={handleWebpayPayment}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="animate-spin" size={20} />}
        {loading ? 'Procesando...' : 'Pagar con Webpay'}
      </button>
    </div>
  );
};
