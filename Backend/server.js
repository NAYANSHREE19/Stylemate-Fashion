import express from 'express';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import rateLimiter from './middleware/rateLimiter.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import styleGuideRoutes from './routes/styleGuideRoutes.js';
import wardrobeRoutes from './routes/wardrobeRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import outfitAnalyzerRoutes from './routes/outfitAnalyzerRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Express app
const app = express();

// Trust proxy (Required for Render/Railway/Heroku)
app.set('trust proxy', 1);

const cspDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();
cspDirectives['img-src'] = ["'self'", 'data:', 'https:'];

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: cspDirectives
  }
})); // Security headers
app.use(compression()); // Compress responses
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '15mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '15mb' })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Logging

// Apply rate limiting to all routes
app.use(rateLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/style-guide', styleGuideRoutes);
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/outfit-analyzer', outfitAnalyzerRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Welcome to StyleMate API',
    version: '1.0.0'
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Resilient path resolution for monorepo deployment
  let frontendPath = path.resolve(process.cwd(), 'Frontend', 'dist');
  
  // If not found in current directory (e.g. if started from Backend folder), look in parent
  if (!fs.existsSync(frontendPath)) {
    frontendPath = path.resolve(process.cwd(), '..', 'Frontend', 'dist');
  }
  
  console.log(`🚀 Serving static files from: ${frontendPath}`);
  
  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    console.error(`❌ ERROR: Frontend build not found at ${frontendPath}`);
    app.get('*', (req, res) => {
      res.status(404).send('Frontend build not found. Please check deployment logs.');
    });
  }
} else {
  app.get('/', (req, res) => {
    res.send('StyleMate API is running...');
  });
}

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 StyleMate API running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('❌ UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
