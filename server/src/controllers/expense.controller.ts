import { Request, Response } from 'express';
import { ExpenseModel } from '../models/expense.model.js';

export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenses = await ExpenseModel.findAll();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve expenses' });
  }
};

export const getExpenseById = async (req: Request, res: Response): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }

  try {
    const expense = await ExpenseModel.findById(id);
    if (!expense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve expense' });
  }
};

export const createExpense = async (req: Request, res: Response): Promise<void> => {
  const { title, amount, category } = req.body;

  if (!title || amount == null || !category) {
    res.status(400).json({ error: 'Title, amount, and category are required' });
    return;
  }

  try {
    const newId = await ExpenseModel.create({ title, amount: Number(amount), category });
    res.status(201).json({ id: newId, title, amount: Number(amount), category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
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
    const updated = await ExpenseModel.update(id, { title, amount: Number(amount), category });
    if (!updated) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    res.json({ id, title, amount: Number(amount), category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }

  try {
    const deleted = await ExpenseModel.delete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};