require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();

connectDB();

// Middleware
app.use(express.json());

// Import routes
const routes = require('./routes');

// Use routes
app.use('/api', routes);

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});