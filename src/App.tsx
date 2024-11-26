import React from 'react';
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

const PRODUCTS_BASE = [
  {
    id: '1',
    name: 'Pañales Premium Clásicos',
    image: 'https://www.maicao.cl/dw/image/v2/BDPM_PRD/on/demandware.static/-/Sites-masterCatalog_Chile/default/dw22f98a25/images/large/293133-pampers-panal-36-unidades.jpg?sw=1000&sh=1000',
    description: 'Pañales ultra suaves con máxima absorción',
    prices: {
      RN: 15990,
      P: 17990,
      M: 19990,
      G: 21990,
      XG: 23990,
      XXG: 25990,
      XXXG: 27990
    },
    unitsPerPack: {
      RN: 36,
      P: 40,
      M: 44,
      G: 40,
      XG: 36,
      XXG: 34,
      XXXG: 32
    }
  },
  {
    id: '2',
    name: 'Pañales Premium Hipoalergénicos',
    image: 'https://dojiw2m9tvv09.cloudfront.net/71536/product/X_babysec-super-premium-xxg4128.png?40&time=1732588659',
    description: 'Especialmente diseñados para pieles sensibles',
    prices: {
      RN: 16990,
      P: 18990,
      M: 20990,
      G: 22990,
      XG: 24990,
      XXG: 26990,
      XXXG: 28990
    },
    unitsPerPack: {
      RN: 34,
      P: 38,
      M: 42,
      G: 38,
      XG: 34,
      XXG: 32,
      XXXG: 30
    }
  },
  {
    id: '3',
    name: 'Pañales Ecológicos Biodegradables',
    image: 'https://xn--ecopaal-8za.cl/wp-content/uploads/2024/01/Panal-Ecologico-Nateen-L-128-unidades-600x600.png',
    description: 'Amigables con el medio ambiente y la piel del bebé',
    prices: {
      RN: 17990,
      P: 19990,
      M: 21990,
      G: 23990,
      XG: 25990,
      XXG: 27990,
      XXXG: 29990
    },
    unitsPerPack: {
      RN: 32,
      P: 36,
      M: 40,
      G: 36,
      XG: 32,
      XXG: 30,
      XXXG: 28
    }
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
                {PRODUCTS_BASE.map((product) => (
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