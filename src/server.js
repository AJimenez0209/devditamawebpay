// src/server.js
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config();

// Inicializar app
const app = express();

// Conexión a MongoDB
connectDB().catch((error) => {
  console.error('❌ Error al conectar con MongoDB:', error);
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
app.use('/api', adminRoutes);

// Archivos estáticos si estamos en producción o integración
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

// Escuchar en puerto fijo
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
