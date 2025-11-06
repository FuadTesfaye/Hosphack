const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 4003;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pharmacy Management API',
      version: '1.0.0',
      description: 'Comprehensive Pharmacy Operations Management System API',
    },
    servers: [
      {
        url: 'http://localhost:4003',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js', './server.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Pharmacy Management API is healthy',
    timestamp: new Date().toISOString(),
    service: 'pharmacy-management-api',
    port: PORT
  });
});

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     summary: Get all medicines
 *     tags: [Medicines]
 *     responses:
 *       200:
 *         description: List of medicines
 *   post:
 *     summary: Add new medicine
 *     tags: [Medicines]
 *     responses:
 *       201:
 *         description: Medicine added
 */
app.get('/api/medicines', (req, res) => {
  res.json({ message: 'Get all medicines', data: [] });
});

app.post('/api/medicines', (req, res) => {
  res.status(201).json({ message: 'Medicine added', data: req.body });
});

/**
 * @swagger
 * /api/pharmacies:
 *   get:
 *     summary: Get all pharmacies
 *     tags: [Pharmacies]
 *     responses:
 *       200:
 *         description: List of pharmacies
 */
app.get('/api/pharmacies', (req, res) => {
  res.json({ message: 'Get all pharmacies', data: [] });
});

/**
 * @swagger
 * /api/prescriptions:
 *   get:
 *     summary: Get prescriptions
 *     tags: [Prescriptions]
 *     responses:
 *       200:
 *         description: List of prescriptions
 */
app.get('/api/prescriptions', (req, res) => {
  res.json({ message: 'Get prescriptions', data: [] });
});

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get inventory status
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Inventory information
 */
app.get('/api/inventory', (req, res) => {
  res.json({ message: 'Get inventory status', data: [] });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Pharmacy Management API Server',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health'
  });
});

app.listen(PORT, () => {
  console.log(`💊 Pharmacy Management API running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
});