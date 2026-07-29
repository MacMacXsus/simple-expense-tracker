import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { db } from '../lib/db'; // adjust path to match your db file location

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  created_at?: Date;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return (rows[0] as User) || null;
};

export const findUserById = async (id: number): Promise<User | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [id]
  );
  return (rows[0] as User) || null;
};

export const createUser = async (name: string, email: string, passwordHash: string): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  return result.insertId;
};