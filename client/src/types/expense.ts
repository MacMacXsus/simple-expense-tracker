export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  created_at?: string;
}

export type CreateExpenseInput = Omit<Expense, 'id' | 'created_at'>;