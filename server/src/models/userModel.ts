import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { db } from '../lib/db'; // adjust path to match your db file location

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  is_verified?: boolean | number;
  verification_otp?: string | null;
  verification_otp_expires_at?: Date | string | null;
  reset_otp?: string | null;
  reset_otp_expires_at?: Date | string | null;
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

export const createOrUpdatePendingUser = async (
  name: string,
  email: string,
  passwordHash: string,
  otp: string,
  expiresAt: Date
): Promise<number> => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    await db.execute(
      `UPDATE users 
       SET name = ?, password = ?, verification_otp = ?, verification_otp_expires_at = ?, is_verified = 0 
       WHERE id = ?`,
      [name, passwordHash, otp, expiresAt, existingUser.id]
    );
    return existingUser.id;
  }

  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO users (name, email, password, verification_otp, verification_otp_expires_at, is_verified) 
     VALUES (?, ?, ?, ?, ?, 0)`,
    [name, email, passwordHash, otp, expiresAt]
  );
  return result.insertId;
};

export const verifyUserAccount = async (userId: number): Promise<void> => {
  await db.execute(
    `UPDATE users 
     SET is_verified = 1, verification_otp = NULL, verification_otp_expires_at = NULL 
     WHERE id = ?`,
    [userId]
  );
};

// Save OTP code and expiration time
export const saveUserOtp = async (userId: number, otp: string, expiresAt: Date): Promise<void> => {
  await db.execute(
    'UPDATE users SET reset_otp = ?, reset_otp_expires_at = ? WHERE id = ?',
    [otp, expiresAt, userId]
  );
};

// Update password and clear OTP fields
export const updateUserPassword = async (userId: number, passwordHash: string): Promise<void> => {
  await db.execute(
    'UPDATE users SET password = ?, reset_otp = NULL, reset_otp_expires_at = NULL WHERE id = ?',
    [passwordHash, userId]
  );
};