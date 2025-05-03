import { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import API_BASE_URL from '../../utils/config';
import { validateProduct, Product } from '../../utils/validateProduct';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch(`${API_BASE_URL}/api/products`, {
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
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
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
    <div className="px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Productos</h2>
        <Link
          to="/admin/products/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow-md"
        >
          ➕ Agregar Producto
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4 font-semibold">{error}</p>}

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-50 text-blue-800 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Imagen</th>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Tallas y Precios</th>
              <th className="px-6 py-4">Stock por Talla</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => (
              <tr key={p._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4">
                  {p.image ? (
                    <img
                      src={p.image.startsWith('http') ? p.image : `${API_BASE_URL}/uploads/${p.image}`}
                      alt={p.name}
                      className="h-16 w-16 object-cover rounded-lg shadow-sm"
                    />

                  ) : (
                    <span className="text-xs text-gray-400">Sin imagen</span>
                  )}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">{p.name}</td>

                {/* TALLAS Y PRECIOS */}
                <td className="px-6 py-4">
                  <div className="grid grid-cols-2 gap-x-4">
                    <div className="text-xs font-semibold text-gray-600">Talla</div>
                    <div className="text-xs font-semibold text-gray-600">Precio</div>

                    {Object.entries(p.prices || {}).map(([size, price]) => (
                      <Fragment key={size}>
                        <div className="text-sm text-gray-700">{size}</div>
                        <div className="text-sm text-gray-800">
                          ${price.toLocaleString('es-CL')}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </td>

                {/* STOCK POR TALLA */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {Object.entries(p.stock || {}).map(([size, qty]) => (
                      <div key={size} className="text-sm text-gray-800">
                        {qty}
                      </div>
                    ))}
                  </div>
                </td>


                <td className="px-6 py-4 text-center space-x-3">
                  <Link
                    to={`/admin/products/${p._id}`}
                    className="inline-flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="inline-flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-full"
                    title="Eliminar"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
