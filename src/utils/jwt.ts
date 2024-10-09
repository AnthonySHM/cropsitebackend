import jwt from 'jsonwebtoken';



import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

export function generateToken(user: any): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

export function verifyToken(token: string): any {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.verify(token, JWT_SECRET);
}
