import Product from '../models/ProductModel.js';

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos.' });
  }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto.' });
  }
};

// Crear nuevo producto
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description
    } = req.body;

    const sizes = JSON.parse(req.body.sizes || '[]');
    const prices = JSON.parse(req.body.prices || '{}');
    const unitsPerPack = JSON.parse(req.body.unitsPerPack || '{}');
    const stock = JSON.parse(req.body.stock || '{}');

    const image = req.file?.filename || '';

    if (!name || !brand || !category || !description || sizes.length === 0) {
      return res.status(400).json({ message: 'Faltan campos requeridos.' });
    }

    const newProduct = new Product({
      name,
      brand,
      category,
      description,
      sizes,
      prices,
      unitsPerPack,
      stock,
      image
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ message: 'Error al crear el producto.', error });
  }
};


// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description
    } = req.body;

    const sizes = JSON.parse(req.body.sizes || '[]');
    const prices = JSON.parse(req.body.prices || '{}');
    const unitsPerPack = JSON.parse(req.body.unitsPerPack || '{}');
    const stock = JSON.parse(req.body.stock || '{}');

    const image = req.file?.filename;

    const updatedFields = {
      name,
      brand,
      category,
      description,
      sizes,
      prices,
      unitsPerPack,
      stock,
    };

    if (image) updatedFields.image = image;

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: 'Producto no encontrado.' });

    res.json(updated);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(400).json({ message: 'Error al actualizar el producto.', error });
  }
};


// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Producto no encontrado.' });
    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto.' });
  }
};
