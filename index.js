require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const cardRoutes = require('./routes/card.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ==================
// Middleware
// ==================

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// JSON body parser with size limit
app.use(express.json({ limit: '10kb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`, { query: req.query });
  next();
});

// ==================
// Routes
// ==================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Card Collection API',
    documentation: 'https://github.com/yourusername/card-collection-api',
    version: '1.0.0',
  });
});

// Mount card routes
app.use('/cards', cardRoutes);

// ==================
// Error Handling
// ==================

// 404 handler
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Not Found',
    message: `The requested endpoint ${req.method} ${req.path} does not exist`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err);
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    timestamp: new Date().toISOString(),
  });
});

// ==================
// Server Startup
// ==================

const server = app.listen(PORT, () => {
  logger.info(`Server started successfully`);
  logger.info(`Environment: ${NODE_ENV}`);
  logger.info(`Listening on http://localhost:${PORT}`);
  if (NODE_ENV !== 'production') {
    logger.info(`Documentation: http://localhost:${PORT}/health`);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
