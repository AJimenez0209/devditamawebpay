import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/adminRoutes.js';



// Necesario para usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
// Importar las rutas de adminRoutes.js
app.use('/api', adminRoutes); // 👈 Ahora accederás a /api/admin/products

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
