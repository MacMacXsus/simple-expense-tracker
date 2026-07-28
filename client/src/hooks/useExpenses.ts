import { useState, useEffect, useCallback } from 'react';
import type { Expense, CreateExpenseInput } from '../types/expense';
import { api } from '../services/api';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getExpenses();
      setExpenses(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (input: CreateExpenseInput) => {
    try {
      const newExpense = await api.createExpense(input);
      setExpenses((prev) => [newExpense, ...prev]);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const editExpense = async (id: number, input: CreateExpenseInput) => {
    try {
      const updated = await api.updateExpense(id, input);
      setExpenses((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const removeExpense = async (id: number) => {
    try {
      await api.deleteExpense(id);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
    addExpense,
    editExpense,
    removeExpense,
  };
}