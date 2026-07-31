import { Request, Response } from 'express';
import { BudgetModel } from '../models/budget.model.js';

interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export const getBudget = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const amount = await BudgetModel.findByUserId(userId);
    res.json({ amount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
};

export const updateBudget = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { amount } = req.body;
  if (amount == null || isNaN(Number(amount)) || Number(amount) < 0) {
    res.status(400).json({ error: 'Valid positive budget amount is required' });
    return;
  }

  try {
    await BudgetModel.upsert(userId, Number(amount));
    res.json({ amount: Number(amount) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update budget' });
  }
};