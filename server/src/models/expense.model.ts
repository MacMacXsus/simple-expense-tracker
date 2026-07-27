import { db } from '../lib/db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Expense {
  id?: number;
  title: string;
  amount: number;
  category: string;
  created_at?: Date;
}

export type CreateExpenseInput = Omit<Expense, 'id' | 'created_at'>;

export const ExpenseModel = {
  async findAll(): Promise<Expense[]> {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM expenses ORDER BY created_at DESC');
    return rows as Expense[];
  },

  async findById(id: number): Promise<Expense | null> {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM expenses WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return rows[0] as Expense;
  },

  async create(expense: CreateExpenseInput): Promise<number> {
    const { title, amount, category } = expense;
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO expenses (title, amount, category) VALUES (?, ?, ?)',
      [title, amount, category]
    );
    return result.insertId;
  },

  async update(id: number, expense: CreateExpenseInput): Promise<boolean> {
    const { title, amount, category } = expense;
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE expenses SET title = ?, amount = ?, category = ? WHERE id = ?',
      [title, amount, category, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>('DELETE FROM expenses WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};