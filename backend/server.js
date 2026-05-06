import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const launchServer = async () => {
  const app = express();
  
  // Middlewares
  app.use(cors());
  app.use(express.json());

  // API routing
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/users', userRoutes);

  // Serve Frontend in Production
  if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
  } else {
    // Health check
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', message: 'API is running optimally' });
    });
  }

  const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/team-task-manager';
  
  try {
    await mongoose.connect(dbUri);
    console.log('Database connected successfully');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server active on port ${PORT}`);
    });
  } catch (error) {
    console.error('Startup failed due to DB connection error:', error);
    process.exit(1);
  }
};

launchServer();
