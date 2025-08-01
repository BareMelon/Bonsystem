const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

console.log('Starting Bon System Backend...');
console.log(`Port: ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting for general requests
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(generalLimiter);

// Specific rate limiting for orders (more restrictive)
const orderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 orders per minute
  message: {
    error: 'For mange bestillinger. Vent venligst 1 minut før du prøver igen.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Simple health check (works even if database fails)
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'Bon System API er kørende',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Bon System Backend er kørende' });
});

// Database setup (with error handling)
console.log('Setting up database...');
let db;
try {
  db = require('./database/database');
  console.log('Database setup completed');
} catch (error) {
  console.error('Database setup failed:', error);
  // Continue without database for now
}

// Routes (always load routes, database handles its own errors)
app.use('/api/orders', orderLimiter, require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/menu', require('./routes/menu'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Noget gik galt!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server kører på port ${PORT}`);
  console.log('Bon System API er klar!');
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
}); 