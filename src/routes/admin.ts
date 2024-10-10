import express, { Request, Response, NextFunction } from 'express';
import Crop from '../models/Crop';
import Comment from '../models/Comment';
import User from '../models/User';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);


// Get all crops
router.get('/crops', (req: Request, res: Response, next: NextFunction) => {
  Crop.find()
    .then(crops => res.json(crops))
    .catch(next);
});

// Get a single crop
router.get('/crops/:id', (req: Request, res: Response, next: NextFunction) => {
  Crop.findById(req.params.id)
    .then(crop => {
      if (!crop) {
        return res.status(404).json({ message: 'Crop not found' });
      }
      res.json(crop);
    })
    .catch(next);
});

// Create a new crop
router.post('/crops', adminMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const cropData = req.body;
  const requiredFields = ['name', 'overview', 'planting', 'care', 'harvest', 'economics'];
  const missingFields = requiredFields.filter(field => !cropData[field]);

  if (missingFields.length > 0) {
    res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    return;
  }

  const newCrop = new Crop(cropData);
  newCrop.save()
    .then(savedCrop => {
      res.status(201).json(savedCrop);
    })
    .catch(err => {
      console.error('Error saving crop:', err);
      if (err instanceof Error) {
        if (err.name === 'ValidationError') {
          res.status(400).json({ error: 'Validation Error', details: err.message });
        } else {
          res.status(500).json({ error: 'Failed to save crop', details: err.message });
        }
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    });
});

// Update a crop
router.put('/crops/:id', (req: Request, res: Response, next: NextFunction) => {
  // Add validation for videos and images
  const { videos, images } = req.body;
  if (videos) {
    Object.values(videos).forEach(sectionVideos => {
      if (!Array.isArray(sectionVideos)) {
        throw new Error('Invalid video structure');
      }
      sectionVideos.forEach(video => {
        if (!video.title || !video.description || !video.url) {
          throw new Error('Invalid video data');
        }
      });
    });
  }
  if (images) {
    Object.values(images).forEach(sectionImages => {
      if (!Array.isArray(sectionImages)) {
        throw new Error('Invalid image structure');
      }
      sectionImages.forEach(image => {
        if (!image.url || !image.caption) {
          throw new Error('Invalid image data');
        }
      });
    });
  }

  if (req.body.rating !== undefined && (req.body.rating < 0 || req.body.rating > 5)) {
    throw new Error('Rating must be between 0 and 5');
  }

  Crop.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updatedCrop => {
      if (!updatedCrop) {
        return res.status(404).json({ message: 'Crop not found' });
      }
      res.json(updatedCrop);
    })
    .catch(next);
});

// Delete a crop
router.delete('/crops/:id', (req: Request, res: Response, next: NextFunction) => {
  Crop.findByIdAndDelete(req.params.id)
    .then(deletedCrop => {
      if (!deletedCrop) {
        return res.status(404).json({ message: 'Crop not found' });
      }
      res.json({ message: 'Crop deleted successfully' });
    })
    .catch(next);
});

// Add these routes for comment management
router.get('/comments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await Comment.find().populate('user', 'username').populate('crop', 'name');
    const formattedComments = comments.map(comment => ({
      _id: comment._id,
      cropName: comment.crop ? (comment.crop as any).name : 'Unknown Crop',
      section: comment.tab || 'Unknown Section',
      userName: comment.user ? (comment.user as any).username : 'Unknown User',
      text: comment.content
    }));
    res.json(formattedComments);
  } catch (error) {
    next(error);
  }
});

router.delete('/comments/:id', (req: Request, res: Response, next: NextFunction) => {
  Comment.findByIdAndDelete(req.params.id)
    .then(comment => {
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      res.json({ message: 'Comment deleted successfully' });
    })
    .catch(next);
});

// GET /admin/users
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({}, 'username email');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// DELETE /admin/users/:id
router.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndDelete(req.params.id)
    .then(deletedUser => {
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    })
    .catch(next);
});

export default router;