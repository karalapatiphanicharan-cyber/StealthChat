const express = require('express');
const app = express();

app.use(express.json());

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
