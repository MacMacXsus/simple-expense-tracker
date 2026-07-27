import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './lib/db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ status: 'ok', message: 'Backend & Aiven MySQL connected!', test: rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
});

// GET /api/expenses - Fetch all expenses
app.get('/api/expenses', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM expenses ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// POST /api/expenses - Add new expense
app.post('/api/expenses', async (req: Request, res: Response) => {
  const { title, amount, category } = req.body;

  if (!title || !amount || !category) {
    res.status(400).json({ error: 'title, amount, and category are required' });
    return;
  }

  try {
    const [result] = await db.query(
      'INSERT INTO expenses (title, amount, category) VALUES (?, ?, ?)',
      [title, amount, category]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      amount,
      category,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});