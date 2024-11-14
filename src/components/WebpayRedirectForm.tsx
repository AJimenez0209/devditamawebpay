// src/components/WebpayRedirectForm.tsx
import React, { useEffect, useRef } from 'react';

interface WebpayRedirectFormProps {
  token: string;
  url: string;
}

export const WebpayRedirectForm: React.FC<WebpayRedirectFormProps> = ({ token, url }) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.submit();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Redirigiendo a Webpay</h2>
        <p className="text-gray-600">Por favor, espere un momento...</p>
        
        <form ref={formRef} action={url} method="POST" className="hidden">
          <input type="hidden" name="token_ws" value={token} />
        </form>
      </div>
    </div>
  );
};
