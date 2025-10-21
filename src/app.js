const express = require('express');
const cors = require('cors');
const stringRoutes = require('./routes/stringRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/', stringRoutes);

// health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// global error handler (simple)
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
