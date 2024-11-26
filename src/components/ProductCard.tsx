import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { BaseProduct, Size } from '../types';
import { useCart } from '../context/CartContext';
import { formatCLP } from '../utils/currency';
import { SIZES, SIZE_WEIGHTS } from '../App';

interface ProductCardProps {
  product: BaseProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();
  const [selectedSize, setSelectedSize] = useState<Size | ''>('');

  const handleAddToCart = () => {
    if (!selectedSize) return;

    const cartItem = {
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} - Talla ${selectedSize}`,
      price: product.prices[selectedSize],
      image: product.image,
      description: `${product.description} - Para bebés de ${SIZE_WEIGHTS[selectedSize]}`,
      size: selectedSize,
      quantity: 1,
      unitsPerPack: product.unitsPerPack[selectedSize],
      formattedPrice: formatCLP(product.prices[selectedSize])
    };

    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  };

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
        
        <div className="mt-4 space-y-3">
          <div className="flex flex-col">
            <label htmlFor={`size-${product.id}`} className="text-sm font-medium text-gray-700 mb-1">
              Seleccionar Talla:
            </label>
            <select
              id={`size-${product.id}`}
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as Size)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccione una talla</option>
              {SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} ({SIZE_WEIGHTS[size]}) - {product.unitsPerPack[size]} unidades
                </option>
              ))}
            </select>
          </div>

          {selectedSize && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {product.unitsPerPack[selectedSize]} unidades por paquete
              </p>
              <p className="text-lg font-bold text-blue-600">
                {formatCLP(product.prices[selectedSize])}
              </p>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            {selectedSize ? 'Agregar al carrito' : 'Seleccione una talla'}
          </button>
        </div>
      </div>
    </div>
  );
};