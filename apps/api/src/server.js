// server.js (կարճացված և կարգավորված տարբերակ)

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') }); // project root .env

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./lib/mongodb');
const { checkAndFreePort } = require('./utils/portChecker');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, try again later.',
});
app.use('/api/', limiter);

// Health check
app.get('/health', async (req, res) => {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'ok',
    services: {},
  };

  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      checks.services.database = 'ok';
    } else {
      checks.services.database = 'disconnected';
      checks.status = 'degraded';
    }
  } catch (error) {
    checks.services.database = `error: ${error.message}`;
    checks.status = 'degraded';
  }

  const statusCode = checks.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(checks);
});

// Example route
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
    detail: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Routes
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const usersRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/admin', adminRoutes);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  const mongoose = require('mongoose');
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Проверяем и освобождаем порт перед запуском (только в режиме разработки)
    if (process.env.NODE_ENV !== 'production') {
      const portFreed = await checkAndFreePort(PORT, true);
      if (!portFreed) {
        console.error(`\n❌ Не удалось освободить порт ${PORT}`);
        console.error(`\n💡 Решение:`);
        console.error(`   1. Найдите процесс вручную: netstat -ano | findstr :${PORT}`);
        console.error(`   2. Остановите процесс: taskkill /PID <PID> /F`);
        console.error(`   3. Или измените порт в .env файле: PORT=3002\n`);
        process.exit(1);
      }
    }

    // Connect to MongoDB
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 API Server running on http://localhost:${PORT}`);
    });

    // Обработка ошибок при запуске сервера
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ Ошибка: Порт ${PORT} уже занят!`);
        console.error(`\n💡 Решение:`);
        console.error(`   1. Найдите процесс, использующий порт: netstat -ano | findstr :${PORT}`);
        console.error(`   2. Остановите процесс: taskkill /PID <PID> /F`);
        console.error(`   3. Или измените порт в .env файле: PORT=3002\n`);
        process.exit(1);
      } else {
        console.error('❌ Ошибка при запуске сервера:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
