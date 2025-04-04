import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (id?: string) => {
    if (!id) return;
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administrador de Productos</h1>
      <Link to="/admin/products/new" className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block">
        ➕ Crear nuevo producto
      </Link>
      <ul className="space-y-4">
        {products.map((product) => (
          <li key={product._id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{product.name}</h2>
            <p>{product.description}</p>
            <div className="mt-2 flex gap-4">
              <Link to={`/admin/products/${product._id}`} className="text-blue-600">✏️ Editar</Link>
              <button onClick={() => deleteProduct(product._id)} className="text-red-600">🗑️ Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
