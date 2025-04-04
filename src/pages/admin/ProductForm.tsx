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
                .then(res => res.json())
                .then(data => setProduct(data));
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;

        if (name.includes('.')) {
            const [field, size] = name.split('.') as ['prices' | 'unitsPerPack' | 'stock', Size];
            setProduct(prev => ({
                ...prev,
                [field]: { ...prev[field], [size]: Number(value) },
            }));
        } else {
            setProduct(prev => ({
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
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-xl font-bold mb-4">{id === 'new' ? 'Crear Producto' : 'Editar Producto'}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="input" name="name" placeholder="Nombre" value={product.name} onChange={handleChange} required />
                <input className="input" name="image" placeholder="URL Imagen" value={product.image} onChange={handleChange} required />
                <textarea className="input" name="description" placeholder="Descripción" value={product.description} onChange={handleChange} required />
                <input className="input" name="brand" placeholder="Marca" value={product.brand} onChange={handleChange} />
                <input className="input" name="category" placeholder="Categoría" value={product.category} onChange={handleChange} />
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="isFeatured" checked={product.isFeatured} onChange={handleChange} />
                    Producto destacado
                </label>

                <div className="grid grid-cols-3 gap-4">
                    {SIZES.map(size => (
                        <div key={size} className="border p-2 rounded">
                            <h3 className="font-semibold mb-2">{size}</h3>
                            <input className="input" type="number" name={`prices.${size}`} placeholder="Precio" value={product.prices[size]} onChange={handleChange} />
                            <input className="input" type="number" name={`unitsPerPack.${size}`} placeholder="Unidades" value={product.unitsPerPack[size]} onChange={handleChange} />
                            <input className="input" type="number" name={`stock.${size}`} placeholder="Stock" value={product.stock[size]} onChange={handleChange} />
                        </div>
                    ))}
                </div>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    {id === 'new' ? 'Crear' : 'Actualizar'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
