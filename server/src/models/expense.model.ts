import { db } from '../lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Expense {
  id?: number;
  user_id: number;
  title: string;
  amount: number;
  category: string;
  created_at?: Date;
}

export type CreateExpenseInput = Omit<Expense, 'id' | 'created_at' | 'user_id'>;

export const ExpenseModel = {
  // Fetch all expenses for a specific user
  async findAll(userId: number): Promise<Expense[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows as Expense[];
  },

  // Fetch a single expense only if it belongs to the user
  async findById(id: number, userId: number): Promise<Expense | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (rows.length === 0) return null;
    return rows[0] as Expense;
  },

  // Create a new expense tied to the user
  async create(userId: number, expense: CreateExpenseInput): Promise<number> {
    const { title, amount, category } = expense;
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO expenses (user_id, title, amount, category) VALUES (?, ?, ?, ?)',
      [userId, title, amount, category]
    );
    return result.insertId;
  },

  // Update an expense only if it belongs to the user
  async update(id: number, userId: number, expense: CreateExpenseInput): Promise<boolean> {
    const { title, amount, category } = expense;
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE expenses SET title = ?, amount = ?, category = ? WHERE id = ? AND user_id = ?',
      [title, amount, category, id, userId]
    );
    return result.affectedRows > 0;
  },

  // Delete an expense only if it belongs to the user
  async delete(id: number, userId: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM expenses WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
};