import express, { Request, Response, NextFunction } from 'express';
import Crop from '../models/Crop';
import Comment from '../models/Comment';
import { authMiddleware } from '../middleware/auth';

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
router.post('/crops', (req: Request, res: Response, next: NextFunction) => {
  const newCrop = new Crop(req.body);
  newCrop.save()
    .then(crop => res.status(201).json(crop))
    .catch(next);
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

export default router;