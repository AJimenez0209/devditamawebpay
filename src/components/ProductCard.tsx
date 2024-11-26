import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            {product.unitsPerPack} unidades por paquete
          </p>
          <p className="text-lg font-bold text-blue-600 mt-2">
            {product.formattedPrice}
          </p>
        </div>

        <button
          onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} />
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};