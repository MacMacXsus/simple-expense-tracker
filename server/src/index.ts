import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expense.routes.js';
import { db } from './lib/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes); // Mount auth routes

// Mount API routes
app.use('/api/expenses', expenseRoutes);

// Add this route in src/index.ts before app.listen()
// for testing database connectivity
app.get('/api/health', async (req, res) => {
  try {
    // Runs a minimal query on the database
    await db.query('SHOW CREATE TABLE expenses');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      message: (error as Error).message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running in MVC layout on http://localhost:${PORT}`);
});