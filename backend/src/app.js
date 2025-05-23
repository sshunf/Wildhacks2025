require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

connectDB();

// Middleware
app.use(express.json());

// Import routes
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173'
      ];
  
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  };
  
  app.use(cors(corsOptions));

// Use routes
app.use('/task', taskRoutes);
app.use('/auth', authRoutes);
app.use('/api', userRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});