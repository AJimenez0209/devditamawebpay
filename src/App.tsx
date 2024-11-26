import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Logo } from './components/Logo';
import { formatCLP } from './utils/currency';

type Size = 'RN' | 'P' | 'M' | 'G' | 'XG' | 'XXG' | 'XXXG';

const SIZES: Size[] = ['RN', 'P', 'M', 'G', 'XG', 'XXG', 'XXXG'];

const SIZE_WEIGHTS = {
  RN: '2-4.5 kg',
  P: '3-6 kg',
  M: '6-10 kg',
  G: '9-12.5 kg',
  XG: '12-15 kg',
  XXG: '14-17 kg',
  XXXG: '+16 kg'
};

const PRODUCTS_BASE = [
  {
    baseId: '1',
    name: 'Pañales Premium Clásicos',
    image: 'https://www.maicao.cl/dw/image/v2/BDPM_PRD/on/demandware.static/-/Sites-masterCatalog_Chile/default/dw22f98a25/images/large/293133-pampers-panal-36-unidades.jpg?sw=1000&sh=1000',
    description: 'Pañales ultra suaves con máxima absorción',
    basePrices: {
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
    baseId: '2',
    name: 'Pañales Premium Hipoalergénicos',
    image: 'https://dojiw2m9tvv09.cloudfront.net/71536/product/X_babysec-super-premium-xxg4128.png?40&time=1732588659',
    description: 'Especialmente diseñados para pieles sensibles',
    basePrices: {
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
    baseId: '3',
    name: 'Pañales Ecológicos Biodegradables',
    image: 'https://xn--ecopaal-8za.cl/wp-content/uploads/2024/01/Panal-Ecologico-Nateen-L-128-unidades-600x600.png',
    description: 'Amigables con el medio ambiente y la piel del bebé',
    basePrices: {
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

// Generate all product variants with sizes
const products = PRODUCTS_BASE.flatMap(product => 
  SIZES.map(size => ({
    id: `${product.baseId}-${size}`,
    name: `${product.name} - Talla ${size}`,
    price: product.basePrices[size],
    image: product.image,
    description: `${product.description} - Para bebés de ${SIZE_WEIGHTS[size]}`,
    size,
    quantity: product.unitsPerPack[size],
    unitsPerPack: product.unitsPerPack[size],
    formattedPrice: formatCLP(product.basePrices[size])
  }))
);

function App() {
  const [selectedSize, setSelectedSize] = useState<Size | 'all'>('all');

  const filteredProducts = selectedSize === 'all' 
    ? products 
    : products.filter(product => product.size === selectedSize);

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
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">Nuestros Productos</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Filtrar por talla:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedSize('all')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedSize === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Todas
                      </button>
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedSize === size
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
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