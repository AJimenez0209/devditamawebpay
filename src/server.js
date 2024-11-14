const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { fileURLToPath } = require('url');
const { dirname, join } = require('path');
const connectDB = require('./config/database');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payment');

dotenv.config();

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Connect to MongoDB
connectDB().catch((error) => {
  console.error('Database connection failed:', error);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
