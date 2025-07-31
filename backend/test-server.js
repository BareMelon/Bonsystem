const express = require('express');

const app = express();
const PORT = process.env.PORT || 5001;

console.log('Starting minimal test server...');
console.log(`Port: ${PORT}`);

// Simple health check
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'Test server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Test server is running' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
}); 