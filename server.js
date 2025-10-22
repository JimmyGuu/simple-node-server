const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for TronLink data
const tronLinkData = new Map();

// Middleware configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root path
app.get('/', (req, res) => {
  res.json({
    message: 'StableFlow Server is running',
    endpoints: {
      'POST /tronlink': 'Receive TronLink data',
      'GET /tronlink?actionId=<id>': 'Retrieve TronLink data by actionId'
    }
  });
});

// TronLink POST endpoint
app.post('/tronlink', (req, res) => {
  try {
    // Validate request body
    const { actionId, address, code, id, message } = req.body;
    
    // Basic validation
    if (!actionId || !address || code === undefined || !id || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: actionId, address, code, id, message'
      });
    }

    // Log received data
    console.log('Received TronLink data:', {
      actionId,
      address,
      code,
      id,
      message,
      timestamp: new Date().toISOString()
    });

    // Process data (extend with your business logic here)
    const processedData = {
      actionId,
      address,
      code,
      id,
      message,
      receivedAt: new Date().toISOString(),
      status: code === 0 ? 'success' : 'error'
    };

    // Store data using actionId as unique key
    tronLinkData.set(actionId, processedData);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Data received successfully',
      data: processedData
    });

  } catch (error) {
    console.error('Error processing TronLink data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// GET /tronlink endpoint - retrieve data by actionId
app.get('/tronlink', (req, res) => {
  try {
    const { actionId } = req.query;
    
    // Validate actionId parameter
    if (!actionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: actionId'
      });
    }

    // Check if data exists for the given actionId
    if (!tronLinkData.has(actionId)) {
      return res.status(404).json({
        success: false,
        error: 'Data not found for the given actionId',
        actionId: actionId
      });
    }

    // Retrieve and return the data
    const data = tronLinkData.get(actionId);
    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: data
    });

  } catch (error) {
    console.error('Error retrieving TronLink data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 TronLink endpoint: http://localhost:${PORT}/tronlink`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
