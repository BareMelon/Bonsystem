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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

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

// Database setup (with error handling) - Updated for better-sqlite3
console.log('Setting up database...');
let db;
try {
  db = require('./database/database');
  console.log('Database setup completed');
} catch (error) {
  console.error('Database setup failed:', error);
  // Continue without database for now
}

// Routes (only if database is available)
if (db) {
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/menu', require('./routes/menu'));
} else {
  console.log('Skipping routes due to database error');
}

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