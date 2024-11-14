// src/components/PaymentComponent.tsx
import React from 'react';
import { WebpayRedirectForm } from './WebpayRedirectForm';

interface PaymentComponentProps {
  token: string;
  url: string;
}

export const PaymentComponent: React.FC<PaymentComponentProps> = ({ token, url }) => {
  return (
    <div>
      <WebpayRedirectForm token={token} url={url} />
    </div>
  );
};

export default PaymentComponent;
