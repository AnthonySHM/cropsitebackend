import express, { Request, Response, NextFunction } from 'express';
import User from '../models/User';

import { generateToken } from '../utils/jwt';

const router = express.Router();

const ADMIN_CREATION_KEY = process.env.ADMIN_CREATION_KEY || '1234567890';

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    try {
      const { username, email, password, isAdmin, adminKey } = req.body;
      
      if (isAdmin && adminKey !== ADMIN_CREATION_KEY) {
        return res.status(403).json({ message: 'Invalid admin creation key' });
      }
      
      // Check if username or email already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        if (existingUser.username === username) {
          return res.status(400).json({ message: 'Username already exists' });
        }
        if (existingUser.email === email) {
          return res.status(400).json({ message: 'Email already exists' });
        }
      }
      
      const user = new User({ username, email, password, isAdmin: isAdmin || false });
      await user.save();
      const token = generateToken(user);
      res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  })();
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    try {
      const { email, password } = req.body;
      User.findOne({ email }).then(user => {
        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
        user.comparePassword(password).then(isMatch => {
          if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
          }
          const token = generateToken(user);
          res.status(200).json({ token });
        });
      }).catch(error => {
        res.status(400).json({ message: 'Login failed' });
      });
    } catch (error) {
      next(error);
    }
  })();
});

export default router;
