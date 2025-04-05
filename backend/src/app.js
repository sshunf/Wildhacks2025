const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Import routes
const routes = require('./routes'); // Adjust the path if necessary

// Use routes
app.use('/api', routes); // Prefix all routes with '/api'

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});