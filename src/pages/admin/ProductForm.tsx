import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SIZES } from '../../constants/sizes';

interface Product {
  _id?: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  prices: Record<string, number>;
  unitsPerPack: Record<string, number>;
  stock: Record<string, number>;
}

const initialProduct: Product = {
  name: '',
  brand: '',
  category: '',
  description: '',
  prices: Object.fromEntries(SIZES.map(size => [size, 0])),
  unitsPerPack: Object.fromEntries(SIZES.map(size => [size, 0])),
  stock: Object.fromEntries(SIZES.map(size => [size, 0])),
};

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product>(initialProduct);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (field: keyof Product, value: string) => {
    setProduct({ ...product, [field]: value });
  };

  const handleSizeChange = (type: 'prices' | 'unitsPerPack' | 'stock', size: string, value: string) => {
    setProduct({
      ...product,
      [type]: { ...product[type], [size]: Number(value) },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const method = id ? 'PUT' : 'POST';
    const url = id
      ? `http://localhost:5000/api/products/${id}`
      : 'http://localhost:5000/api/products';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error('Error al guardar');

      navigate('/admin/products');
    } catch (err) {
      setError('Error al guardar producto');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Producto' : 'Nuevo Producto'}</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Nombre"
          value={product.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full border p-2"
        />

        <input
          type="text"
          placeholder="Marca"
          value={product.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
          className="w-full border p-2"
        />

        <input
          type="text"
          placeholder="Categoría"
          value={product.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full border p-2"
        />

        <textarea
          placeholder="Descripción"
          value={product.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full border p-2"
        />

        <h3 className="text-xl font-semibold mb-2 text-blue-700">Precios y Stock por Tamaño</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SIZES.map((size) => (
            <div key={size} className="border rounded p-4 bg-gray-50">
              <h4 className="font-bold text-blue-600 mb-2">{size}</h4>

              <label className="block text-sm text-gray-600 mb-1">Precio</label>
              <input
                type="number"
                value={product.prices[size]}
                onChange={(e) => handleSizeChange('prices', size, e.target.value)}
                className="w-full border px-2 py-1 mb-2"
              />

              <label className="block text-sm text-gray-600 mb-1">Unidades por Paquete</label>
              <input
                type="number"
                value={product.unitsPerPack[size]}
                onChange={(e) => handleSizeChange('unitsPerPack', size, e.target.value)}
                className="w-full border px-2 py-1 mb-2"
              />

              <label className="block text-sm text-gray-600 mb-1">Stock</label>
              <input
                type="number"
                value={product.stock[size]}
                onChange={(e) => handleSizeChange('stock', size, e.target.value)}
                className="w-full border px-2 py-1"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Volver
          </button>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {id ? 'Actualizar Producto' : 'Agregar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
