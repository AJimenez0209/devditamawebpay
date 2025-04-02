const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { join } = require('path');
const connectDB = require('./config/database');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payment');
import productRoutes from './routes/productRoutes.js';


console.log("Payment routes loaded");
require('dotenv').config();




// Configuración de variables de entorno
dotenv.config();

// Inicialización de la aplicación de Express
const app = express();

// Conexión a MongoDB
connectDB().catch((error) => {
  console.error('Database connection failed:', error);
  process.exit(1);
});

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);


// Manejo de archivos estáticos en producción e integración
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'integracion') {
  app.use(express.static(join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}


// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ message: 'Error interno del servidor.' });
});

// Configuración del puerto y arranque del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
