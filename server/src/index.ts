import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import { brandingRoutes } from './routes/brandingRoutes.js';
import { careerRoutes } from './routes/careerRoutes.js';
import { demoRoutes } from './routes/demoRoutes.js';
import { interviewRoutes } from './routes/interviewRoutes.js';
import { jobRoutes } from './routes/jobRoutes.js';
import { resumeRoutes } from './routes/resumeRoutes.js';
import { roadmapRoutes } from './routes/roadmapRoutes.js';
import { systemRoutes } from './routes/systemRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Security & CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (sanitized, never logging resumes or sensitive tokens)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`[${req.method}] ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api/career', careerRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/learning', roadmapRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/branding', brandingRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/system', systemRoutes);

// Root health probe
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    name: 'CareerPilot AI API Server',
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Unhandled Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected internal server error occurred.'
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 CareerPilot AI Backend Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
