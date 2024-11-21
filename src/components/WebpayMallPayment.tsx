import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { WebpayRedirectForm } from './WebpayRedirectForm';

interface WebpayMallPaymentProps {
  orderId: string;
  items: Array<{
    amount: number;
    storeIndex: number;
  }>;
}

export const WebpayMallPayment: React.FC<WebpayMallPaymentProps> = ({ orderId, items }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<{ token: string; url: string } | null>(null);

  const handleWebpayPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calcular el total del monto
      const amount = items.reduce((sum, item) => sum + item.amount, 0);

      // Generar un sessionId único
      const sessionId = `SESSION-${Date.now()}`;

      // Enviar la solicitud al backend (el backend genera el `returnUrl`)
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyOrder: orderId, // Corresponde al ID de la orden principal
          sessionId, // ID de sesión único
          amount, // Total del monto
          returnUrl: `${window.location.origin}/payment/result`, // URL de retorno
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar el pago');
      }

      const data = await response.json();
      console.log('Respuesta del backend:', data); // Log para depuración

      if (data.response?.url && data.response?.token) {
        setPaymentData({ token: data.response.token, url: data.response.url }); // Ajusta para acceder correctamente
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error iniciando el pago:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
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
