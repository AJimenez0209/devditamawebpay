import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Product, Size } from '../../types';

const SIZES: Size[] = ['RN', 'P', 'M', 'G', 'XG', 'XXG', 'XXXG'];

const initialProduct: Product = {
  _id: '',
  name: '',
  image: '',
  description: '',
  brand: '',
  category: '',
  isFeatured: false,
  sizes: SIZES,
  prices: Object.fromEntries(SIZES.map(s => [s, 0])) as Product['prices'],
  unitsPerPack: Object.fromEntries(SIZES.map(s => [s, 0])) as Product['unitsPerPack'],
  stock: Object.fromEntries(SIZES.map(s => [s, 0])) as Product['stock'],
};

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>(initialProduct);

  useEffect(() => {
    if (id && id !== 'new') {
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name.includes('.')) {
      const [field, size] = name.split('.') as ['prices' | 'unitsPerPack' | 'stock', Size];
      setProduct((prev) => ({
        ...prev,
        [field]: { ...prev[field], [size]: Number(value) },
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = id && id !== 'new' ? 'PUT' : 'POST';
    const url = id && id !== 'new' ? `/api/products/${id}` : '/api/products';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    if (res.ok) navigate('/admin/products');
    else alert('Error al guardar producto');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">
        {id === 'new' ? 'Crear Producto' : `Editar Producto: ${product.name}`}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Datos Generales */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Datos Generales</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" name="name" placeholder="Nombre" value={product.name} onChange={handleChange} required />
            <input className="input" name="image" placeholder="URL Imagen" value={product.image} onChange={handleChange} required />
          </div>

          {product.image && (
            <div className="mt-4">
              <img src={product.image} alt={product.name} className="w-40 h-40 object-cover rounded border mx-auto" />
            </div>
          )}

          <textarea className="input mt-4" name="description" placeholder="Descripción" value={product.description} onChange={handleChange} required />
        </div>

        {/* Información Comercial */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Información Comercial</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" name="brand" placeholder="Marca" value={product.brand} onChange={handleChange} />
            <input className="input" name="category" placeholder="Categoría" value={product.category} onChange={handleChange} />
          </div>

          <label className="flex items-center gap-2 mt-4">
            <input type="checkbox" name="isFeatured" checked={product.isFeatured} onChange={handleChange} />
            <span className="text-sm text-gray-700">Producto destacado</span>
          </label>
        </div>

        {/* Precios / Stock */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Precios y Stock por Tamaño</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SIZES.map((size) => (
              <div key={size} className="border p-4 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-center mb-2 text-blue-600">{size}</h3>

                <input className="input mb-2" type="number" name={`prices.${size}`} placeholder="Precio" value={product.prices[size]} onChange={handleChange} />
                <input className="input mb-2" type="number" name={`unitsPerPack.${size}`} placeholder="Unidades Pack" value={product.unitsPerPack[size]} onChange={handleChange} />
                <input className="input" type="number" name={`stock.${size}`} placeholder="Stock" value={product.stock[size]} onChange={handleChange} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl shadow-md transition">
          {id === 'new' ? 'Crear Producto' : 'Actualizar Producto'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
