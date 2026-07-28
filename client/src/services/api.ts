import type { Expense, CreateExpenseInput } from '../types/expense';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/expenses';

export const api = {
  async getExpenses(): Promise<Expense[]> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return response.json();
  },

  async createExpense(data: CreateExpenseInput): Promise<Expense> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create expense');
    return response.json();
  },

  async updateExpense(id: number, data: CreateExpenseInput): Promise<Expense> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update expense');
    return response.json();
  },

  async deleteExpense(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete expense');
  },
};