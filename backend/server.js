const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow production domain
    if (origin.includes('muathaga.com')) {
      return callback(null, true);
    }
    
    // Allow Netlify domains
    if (origin.includes('netlify.app')) {
      return callback(null, true);
    }
    
    // Allow Render domains
    if (origin.includes('onrender.com')) {
      return callback(null, true);
    }
    
    // Allow any origin for now (you can restrict this later)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// MongoDB connection - using 'muathaqa' database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://webiqueuser:webiquepassword@cluster0.d6rpmuc.mongodb.net/muathaqa?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

// Import routes
const propertiesRoute = require('./routes/properties');
const citiesRoute = require('./routes/cities');

// Use routes
app.use('/api/properties', propertiesRoute);
app.use('/api/cities', citiesRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Muathaqa Connect API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
