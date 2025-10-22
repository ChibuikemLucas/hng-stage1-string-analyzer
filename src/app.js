const express = require('express');
const cors = require('cors');
const stringRoutes = require('./routes/stringRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Base route 
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to the HNG Stage 1 String Analyzer API 🚀",
        routes: {
            analyze: "POST /strings",
            getString: "GET /strings/:string_value",
            getAll: "GET /strings",
            filterByNaturalLanguage: "GET /strings/filter-by-natural-language?query=",
            delete: "DELETE /strings/:string_value"
        },
        author: "Lucas-Emerenini Chibuikem Kennedy"
    });
});

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
