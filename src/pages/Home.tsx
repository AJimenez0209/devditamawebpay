// src/pages/Home.tsx
import  { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Cart } from '../components/Cart';
import { Checkout } from '../components/Checkout';
import { Product } from '../types';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error al cargar productos:', error));
  }, []);

  return (
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
  );
};

export default Home;
