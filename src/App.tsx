import React, { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Logo } from './components/Logo';
import { formatCLP } from './utils/currency';
import { Product, Size } from './types';

export const SIZES: Size[] = ['RN', 'P', 'M', 'G', 'XG', 'XXG', 'XXXG'];

export const SIZE_WEIGHTS = {
  RN: '2-4.5 kg',
  P: '3-6 kg',
  M: '6-10 kg',
  G: '9-12.5 kg',
  XG: '12-15 kg',
  XXG: '14-17 kg',
  XXXG: '+16 kg'
} as const;

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error al cargar productos:', error));
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <Logo />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuestros Productos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Cart />
              <Checkout />
            </div>
          </div>
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
