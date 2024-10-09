import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new Error('No token provided'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    next(new Error('Invalid token'));
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user || !(req.user as any).isAdmin) {
    return next(new Error('Admin access required'));
  }
  next();
}
