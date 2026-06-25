import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Environment } from '../../src/config/environment.js';
import { CONFIG, sanitizeError } from '../../src/config/constants.js';
import { WizardService } from './services/wizard-service.js';
import { SessionManager } from './services/session-manager.js';
import { SocketController } from './controllers/socket-controller.js';
import { createApiRoutes } from './routes/api-routes.js';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Validate configuration
const validation = Environment.validate();
if (!validation.isValid) {
  console.error('Configuration error:', validation.errors.join(', '));
  process.exit(1);
}

const { apiKey, model } = validation.config;
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: CONFIG.INPUT.MAX_REQUEST_BODY_SIZE }));

// Initialize services
const sessionManager = new SessionManager();
const wizardService = new WizardService(apiKey, model);
const socketController = new SocketController(io, sessionManager, wizardService);

// API routes
app.use('/api', createApiRoutes(sessionManager, wizardService));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    sessions: sessionManager.getAllSessions().length,
  });
});

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDistPath));

  // Handle client-side routing - send all non-API requests to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Socket.IO connection handler
io.on('connection', (socket) => {
  socketController.handleConnection(socket);
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Log full details server-side for debugging
  console.error('Error:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error('Stack trace:', err.stack);
  }

  // Payload too large (from express.json limit)
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request payload too large' });
  }

  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: sanitizeError(err, 'Internal server error'),
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🔗 Frontend URL: ${FRONTEND_URL}`);
  console.log(`🤖 Using model: ${model}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  sessionManager.stopCleanup();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});