import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
  sizes: string[];
  image?: string;
}

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product>({
    name: '',
    brand: '',
    category: '',
    description: '',
    prices: {},
    unitsPerPack: {},
    stock: {},
    sizes: [],
  });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/products/${id}`);
          const data = await res.json();

          setProduct({
            ...data,
            prices: data.prices || {},
            unitsPerPack: data.unitsPerPack || {},
            stock: data.stock || {},
            sizes: Array.isArray(data.sizes) ? data.sizes : [],
          });

          setSelectedSizes(Array.isArray(data.sizes) ? data.sizes : []);
        } catch (err) {
          setError('Error al cargar producto');
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleFieldChange = (field: keyof Product, value: string) => {
    setProduct({ ...product, [field]: value });
  };

  const handleSizeToggle = (size: string) => {
    const updatedSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(updatedSizes);
  };

  const handleSizeValueChange = (field: 'prices' | 'unitsPerPack' | 'stock', size: string, value: string) => {
    setProduct({
      ...product,
      [field]: {
        ...product[field],
        [size]: Number(value),
      },
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('brand', product.brand);
    formData.append('category', product.category);
    formData.append('description', product.description);
    formData.append('sizes', JSON.stringify(selectedSizes));
    formData.append('prices', JSON.stringify(product.prices));
    formData.append('unitsPerPack', JSON.stringify(product.unitsPerPack));
    formData.append('stock', JSON.stringify(product.stock));
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await fetch(
        id ? `http://localhost:5000/api/products/${id}` : 'http://localhost:5000/api/products',
        {
          method: id ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error('Error al guardar producto');
      navigate('/admin/products');
    } catch (err) {
      setError('Error al guardar producto');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Producto' : 'Agregar Producto'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={product.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Marca"
            value={product.brand}
            onChange={(e) => handleFieldChange('brand', e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Categoría"
            value={product.category}
            onChange={(e) => handleFieldChange('category', e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
          />
        </div>

        <textarea
          placeholder="Descripción del producto"
          value={product.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <div>
          <h3 className="text-lg font-semibold mb-2">Selecciona Tallas</h3>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-1 rounded border ${
                  selectedSizes.includes(size)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedSizes.map((size) => (
            <div key={size} className="border p-4 rounded bg-gray-50 shadow-sm">
              <h4 className="text-blue-700 font-semibold mb-2">{size}</h4>
              <label className="block text-sm text-gray-600 mb-1">Precio</label>
              <input
                type="number"
                value={product.prices[size] || ''}
                onChange={(e) => handleSizeValueChange('prices', size, e.target.value)}
                className="w-full border px-2 py-1 mb-2"
              />

              <label className="block text-sm text-gray-600 mb-1">Unidades por Paquete</label>
              <input
                type="number"
                value={product.unitsPerPack[size] || ''}
                onChange={(e) => handleSizeValueChange('unitsPerPack', size, e.target.value)}
                className="w-full border px-2 py-1 mb-2"
              />

              <label className="block text-sm text-gray-600 mb-1">Stock</label>
              <input
                type="number"
                value={product.stock[size] || ''}
                onChange={(e) => handleSizeValueChange('stock', size, e.target.value)}
                className="w-full border px-2 py-1"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          >
            {id ? 'Actualizar Producto' : 'Agregar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
