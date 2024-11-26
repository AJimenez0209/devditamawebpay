import React from 'react';
import { CartProvider } from './context/CartContext';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Logo } from './components/Logo';
import { formatCLP } from './utils/currency';

const products = [
  {
    id: '1',
    name: 'Pañales Premium Recién Nacido',
    price: 15990,
    image: 'https://www.maicao.cl/dw/image/v2/BDPM_PRD/on/demandware.static/-/Sites-masterCatalog_Chile/default/dw22f98a25/images/large/293133-pampers-panal-36-unidades.jpg?sw=1000&sh=1000',
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
    image: 'https://dojiw2m9tvv09.cloudfront.net/71536/product/X_babysec-super-premium-xxg4128.png?40&time=1732588659',
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
    image: 'https://xn--ecopaal-8za.cl/wp-content/uploads/2024/01/Panal-Ecologico-Nateen-L-128-unidades-600x600.png',
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