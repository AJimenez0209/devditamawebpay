import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { validateProduct, Product } from '../../utils/validateProduct';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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

        const validatedProducts = data.map((p: any) => validateProduct(p));
        setProducts(validatedProducts);
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
    <>
      <h3 className="text-xl font-semibold mb-4">Productos</h3>

      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Imagen</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Precios</th>
            <th className="p-2">Tamaños</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-2">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>

              <td className="p-2">{p.name}</td>

              <td className="p-2">
                {p.prices ? (
                  <div className="text-sm">
                    {Object.entries(p.prices).map(([size, price]) => (
                      <div key={size} className="flex justify-between">
                        <span className="font-medium text-gray-600">{size}:</span>
                        <span>${price.toLocaleString('es-CL')}</span>
                      </div>
                    ))}
                  </div>
                ) : 'Sin precios'}
              </td>

              <td className="p-2">
                {p.sizes.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {p.sizes.map((size) => (
                      <span
                        key={size}
                        className="bg-blue-100 text-blue-700 px-2 py-0.5 text-xs rounded-md border border-blue-200"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                ) : 'Sin tallas'}
              </td>

              <td className="p-2 flex gap-2">
                <Link
                  to={`/admin/products/${p._id}`}
                  className="text-blue-600 hover:text-blue-800"
                  title="Editar"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Eliminar"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
  export default ProductList;
