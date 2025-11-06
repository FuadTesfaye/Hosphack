const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4002;

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
      title: 'VideoSDK Telehealth API',
      version: '1.0.0',
      description: 'Advanced Video Consultation System API with Zoom SDK Integration',
    },
    servers: [
      {
        url: 'http://localhost:4002',
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
    message: 'VideoSDK Telehealth API is healthy',
    timestamp: new Date().toISOString(),
    service: 'videosdk-telehealth-api',
    port: PORT
  });
});

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Get video sessions
 *     tags: [Video Sessions]
 *     responses:
 *       200:
 *         description: List of video sessions
 *   post:
 *     summary: Create new video session
 *     tags: [Video Sessions]
 *     responses:
 *       201:
 *         description: Session created
 */
app.get('/api/sessions', (req, res) => {
  res.json({ message: 'Get video sessions', data: [] });
});

app.post('/api/sessions', (req, res) => {
  res.status(201).json({ message: 'Video session created', data: req.body });
});

/**
 * @swagger
 * /api/consultations:
 *   get:
 *     summary: Get consultations
 *     tags: [Consultations]
 *     responses:
 *       200:
 *         description: List of consultations
 */
app.get('/api/consultations', (req, res) => {
  res.json({ message: 'Get consultations', data: [] });
});

/**
 * @swagger
 * /api/zoom/token:
 *   post:
 *     summary: Generate Zoom SDK token
 *     tags: [Zoom SDK]
 *     responses:
 *       200:
 *         description: Zoom token generated
 */
app.post('/api/zoom/token', (req, res) => {
  const token = jwt.sign(
    { sessionId: req.body.sessionId || 'demo-session' },
    'demo-secret',
    { expiresIn: '1h' }
  );
  res.json({ token, message: 'Zoom SDK token generated' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'VideoSDK Telehealth API Server',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health'
  });
});

app.listen(PORT, () => {
  console.log(`📹 VideoSDK Telehealth API running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
});