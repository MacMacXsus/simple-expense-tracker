import { Request, Response } from 'express';
import { ExpenseModel } from '../models/expense.model.js';

// Extend Request type to recognize user injected by auth middleware
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const getExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const expenses = await ExpenseModel.findAll(userId);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve expenses' });
  }
};

export const getExpenseById = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }

  try {
    const expense = await ExpenseModel.findById(id, userId);
    if (!expense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve expense' });
  }
};

export const createExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { title, amount, category } = req.body;

  if (!title || amount == null || !category) {
    res.status(400).json({ error: 'Title, amount, and category are required' });
    return;
  }

  try {
    const newId = await ExpenseModel.create(userId, {
      title,
      amount: Number(amount),
      category,
    });
    res.status(201).json({
      id: newId,
      user_id: userId,
      title,
      amount: Number(amount),
      category,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

export const updateExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const { title, amount, category } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }

  if (!title || amount == null || !category) {
    res.status(400).json({ error: 'Title, amount, and category are required' });
    return;
  }

  try {
    const updated = await ExpenseModel.update(id, userId, {
      title,
      amount: Number(amount),
      category,
    });
    if (!updated) {
      res.status(404).json({ error: 'Expense not found or unauthorized' });
      return;
    }
    res.json({ id, user_id: userId, title, amount: Number(amount), category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }

  try {
    const deleted = await ExpenseModel.delete(id, userId);
    if (!deleted) {
      res.status(404).json({ error: 'Expense not found or unauthorized' });
      return;
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};