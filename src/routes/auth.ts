import express, { Request, Response, Router } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

const router: Router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

router.post('/login', (req: Request, res: Response) => {
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
    res.status(400).json({ message: 'Login failed' });
  }
});

export default router;
