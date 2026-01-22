const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

// Initialize express app
const app = express();

/**
 * CORS configuration:
 * - Prefer ALLOWED_ORIGINS env var (comma-separated)
 * - Fallback to '*' for beginner-friendliness in local/dev
 */
function buildCorsOptions() {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (allowedOrigins.length === 0) {
    return {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: Number(process.env.CORS_MAX_AGE || 600),
    };
  }

  return {
    origin: allowedOrigins,
    methods: (process.env.ALLOWED_METHODS || 'GET,POST,PUT,DELETE,PATCH,OPTIONS').split(',').map(s => s.trim()),
    allowedHeaders: (process.env.ALLOWED_HEADERS || 'Content-Type,Authorization').split(',').map(s => s.trim()),
    maxAge: Number(process.env.CORS_MAX_AGE || 600),
    credentials: false,
  };
}

const trustProxy = String(process.env.TRUST_PROXY || '').toLowerCase() === 'true';
app.set('trust proxy', trustProxy);

// Security + logging
app.use(helmet());
app.use(morgan('combined'));

// Rate limiting (simple, environment-driven)
app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_S || 60) * 1000,
    limit: Number(process.env.RATE_LIMIT_MAX || 100),
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(cors(buildCorsOptions()));

// Parse JSON request body
app.use(express.json());

// Swagger UI with dynamic server URL
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Mount routes
app.use('/', routes);

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Avoid leaking internals; log full error server-side.
  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

module.exports = app;

