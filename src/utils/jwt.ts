import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export function generateToken(user: IUser): string {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
