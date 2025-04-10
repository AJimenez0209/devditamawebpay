import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  sizes: string[];
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:5000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error al obtener productos');

        setProducts(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error desconocido');
        }
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('No se pudo eliminar');

      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Productos</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Nombre</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Tamaños</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">${p.price}</td>
              <td className="p-2">{p.sizes?.join(', ') || 'Sin tallas'}</td>
              <td className="p-2 space-x-2">
                <Link
                  to={`/admin/products/${p._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
