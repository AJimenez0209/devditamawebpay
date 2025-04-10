export interface Product {
    _id: string;
    name: string;
    price: number;
    sizes: string[];
    image: string;
  }
  
  export const validateProduct = (product: any): Product => {
    return {
      _id: product._id || 'unknown',
      name: product.name || 'Producto sin nombre',
      price: typeof product.price === 'number' ? product.price : 0,
      sizes: Array.isArray(product.sizes) ? product.sizes : [],
      image: product.image || '/placeholder.png',
    };
  };
  