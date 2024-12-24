import React from 'react';
import { CheckCircle } from 'lucide-react';

interface NotificationProps {
  message: string;
  productName: string;
  size: string;
}

export const Notification: React.FC<NotificationProps> = ({ message, productName, size }) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg p-4 max-w-md animate-fade-in">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-gray-900">{message}</p>
          <p className="text-sm text-gray-600 mt-1">
            {productName} - Talla {size}
          </p>
        </div>
      </div>
    </div>
  );
};