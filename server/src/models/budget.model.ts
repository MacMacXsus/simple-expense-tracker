import { db } from '../lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Budget {
  id?: number;
  user_id: number;
  amount: number;
  updated_at?: Date;
}

export const BudgetModel = {
  // Get user budget or create a default $2000 budget if none exists
  async findByUserId(userId: number): Promise<number> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT amount FROM budgets WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      // Default to 2000 if not set yet
      await db.query(
        'INSERT INTO budgets (user_id, amount) VALUES (?, 2000.00)',
        [userId]
      );
      return 2000;
    }

    return Number(rows[0].amount);
  },

  // Insert or update budget for user (UPSERT)
  async upsert(userId: number, amount: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO budgets (user_id, amount) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE amount = VALUES(amount)`,
      [userId, amount]
    );
    return result.affectedRows > 0;
  }
};