const express = require('express');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} → ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

module.exports = app;
