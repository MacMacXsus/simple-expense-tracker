import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, findUserById, createOrUpdatePendingUser, 
  verifyUserAccount, saveUserOtp, updateUserPassword } from '../models/userModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { sendOtpEmail } from '../lib/email';


const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const generateToken = (id: number, email: string) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

// 1. Initial Registration Step (Sends OTP)
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill out all fields' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser && Boolean(existingUser.is_verified)) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await createOrUpdatePendingUser(name, email, hashedPassword, otp, expiresAt);
    await sendOtpEmail(email, name, otp);

    return res.status(200).json({ message: 'Verification OTP sent to your email.' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// 2. Verify Registration OTP and Complete Signup
export const verifyRegistration = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.verification_otp || !user.verification_otp_expires_at) {
      return res.status(400).json({ message: 'Invalid or expired verification request' });
    }

    const isExpired = new Date() > new Date(user.verification_otp_expires_at);
    if (isExpired || user.verification_otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    await verifyUserAccount(user.id);

    const token = generateToken(user.id, user.email);
    res.cookie('token', token, COOKIE_OPTIONS);

    return res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Verify registration error:', error);
    return res.status(500).json({ message: 'Server error verifying OTP' });
  }
};

// 3. Updated Login Guard (Prevents unverified logins)
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Please verify your email address before signing in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.email);

    res.cookie('token', token, COOKIE_OPTIONS);
    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  return res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching profile' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      // Return 200 even if user doesn't exist to prevent account enumeration
      return res.json({ message: 'If an account exists, an OTP has been sent.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await saveUserOtp(user.id, otp, expiresAt);
    await sendOtpEmail(user.email, user.name, otp);

    return res.json({ message: 'OTP sent successfully to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Error processing forgot password request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.reset_otp || !user.reset_otp_expires_at) {
      return res.status(400).json({ message: 'Invalid or expired OTP request' });
    }

    const isExpired = new Date() > new Date(user.reset_otp_expires_at);
    if (isExpired || user.reset_otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await updateUserPassword(user.id, hashedPassword);

    return res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Error resetting password' });
  }
};