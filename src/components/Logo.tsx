import React from 'react';
import { Baby } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="absolute -inset-1 bg-blue-100 rounded-full blur"></div>
        <Baby className="relative h-10 w-10 text-blue-600" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          <span className="text-blue-600">Baby</span>
          <span className="text-gray-800">Diapers</span>
        </h1>
        <p className="text-xs text-gray-500 -mt-1">Tu tienda de confianza</p>
      </div>
    </div>
  );
};