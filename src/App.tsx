import React from 'react';
import { Baby } from 'lucide-react';
import { CartProvider } from './context/CartContext';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { formatCLP } from './utils/currency';

const products = [
  {
    id: '1',
    name: 'Pañales Premium Recién Nacido',
    price: 15990,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
    description: 'Pañales ultra suaves para recién nacidos',
    size: 'RN',
    quantity: 36,
    unitsPerPack: 36,
    formattedPrice: formatCLP(15990)
  },
  {
    id: '2',
    name: 'Pañales Súper Absorbentes',
    price: 19990,
    image: 'https://images.unsplash.com/photo-1606791422814-b32c705e3e2f?auto=format&fit=crop&q=80&w=600',
    description: 'Máxima protección día y noche',
    size: 'M',
    quantity: 48,
    unitsPerPack: 48,
    formattedPrice: formatCLP(19990)
  },
  {
    id: '3',
    name: 'Pañales Ecológicos',
    price: 22990,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600',
    description: 'Amigables con el medio ambiente',
    size: 'G',
    quantity: 40,
    unitsPerPack: 40,
    formattedPrice: formatCLP(22990)
  }
];

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Baby className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">BabyDiapers</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuestros Productos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
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