import express, { Request, Response, NextFunction } from 'express';
import Comment from '../models/Comment';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get comments for a specific crop and tab (no authentication required)
router.get('/:cropId/:tab', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cropId, tab } = req.params;
    const comments = await Comment.find({ crop: cropId, tab })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

// Add a new comment (authentication required)
router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cropId, tab, content } = req.body;
    const userId = (req as any).user.id; // Get the user ID from the auth middleware

    const newComment = new Comment({
      user: userId,
      crop: cropId,
      tab,
      content
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

export default router;
