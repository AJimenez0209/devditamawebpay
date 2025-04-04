import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Size } from '../types';
import { useCart } from '../context/CartContext';
import { formatCLP } from '../utils/currency';
import { SIZES, SIZE_WEIGHTS } from '../App';
import { Notification } from './Notification';
import { Product } from '../types';
import { CartItem } from '../types';

interface ProductCardProps {
  product: Product;
}



export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();
  const [selectedSize, setSelectedSize] = useState<Size | ''>('');
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) return;

    const cartItem: CartItem = {
      _id: product._id,
      size: selectedSize, // ✅ esto es lo que faltaba
      name: `${product.name} - Talla ${selectedSize}`,
      image: product.image,
      description: `${product.description} - Para bebés de ${SIZE_WEIGHTS[selectedSize]}`,
      prices: product.prices,
      unitsPerPack: product.unitsPerPack,
      stock: product.stock,
      brand: product.brand,
      category: product.category,
      isFeatured: product.isFeatured,
      quantity: 1,
      unitsInPack: product.unitsPerPack[selectedSize],
      formattedPrice: formatCLP(product.prices[selectedSize]),
    };


    dispatch({ type: 'ADD_ITEM', payload: cartItem });

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };


  return (
    <>
      {showNotification && (
        <Notification
          message="¡Producto agregado al carrito!"
          productName={product.name}
          size={selectedSize}
        />
      )}

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
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Seleccionar Talla:</p>
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map((size) => (
                  <label
                    key={size}
                    className={`
                      relative flex flex-col items-center justify-center p-2 rounded-lg border cursor-pointer
                      transition-all duration-200 hover:border-blue-500
                      ${selectedSize === size ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}
                    `}
                  >
                    <input
                      type="radio"
                      name={`size-${product._id}`}
                      value={size}
                      checked={selectedSize === size}
                      onChange={(e) => setSelectedSize(e.target.value as Size)}
                      className="sr-only"
                    />
                    <span className={`text-sm font-semibold ${selectedSize === size ? 'text-blue-600' : 'text-gray-900'}`}>
                      {size}
                    </span>
                    <span className="text-xs text-gray-500 text-center">
                      {SIZE_WEIGHTS[size]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {selectedSize && (
              <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Unidades por paquete:
                  </p>
                  <span className="font-semibold">
                    {product.unitsPerPack?.[selectedSize] ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Precio:
                  </p>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCLP(product.prices[selectedSize])}
                  </span>
                </div>
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
    </>
  );
};