import express, { Request, Response, NextFunction } from 'express';
import Crop from '../models/Crop';
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

export default router;