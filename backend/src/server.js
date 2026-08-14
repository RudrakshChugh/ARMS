import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import versionRoutes from './routes/versionRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import stageRoutes from './routes/stageRoutes.js';
import releaseRoutes from './routes/releaseRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('Fatal configuration error: JWT_SECRET environment variable is missing.');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('Fatal configuration error: DATABASE_URL environment variable is missing.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure CORS (restricting credentials access selectively)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or REST tools queries (like postman/curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Access blocked by CORS policy.'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Serve uploads static asset directory locally (Fallback development storage)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes bindings
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/versions', versionRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/stages', stageRoutes);
app.use('/api/releases', releaseRoutes);
app.use('/api/files', fileRoutes);

// General 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint resource not found.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express Error boundary caught:', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error occurred.' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`UCS503 Backend API Server successfully running on port ${PORT}`);
  });
}

export default app;
