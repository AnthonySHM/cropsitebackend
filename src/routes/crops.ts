import express, { Request, Response, NextFunction } from 'express';
import Crop from '../models/Crop';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, minRating } = req.query;
    let query: any = {};

    if (search) {
      query.name = { $regex: search as string, $options: 'i' };
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating as string) };
    }

    const crops = await Crop.find(query).select('name image rating');
    const cropsWithDefaultRating = crops.map(crop => ({
      ...crop.toObject(),
      rating: crop.rating || 0 // Set default rating to 0 if it's undefined
    }));
    console.log('Found crops:', cropsWithDefaultRating);
    res.json(cropsWithDefaultRating);
  } catch (error) {
    console.error('Error in /crops route:', error);
    next(error);
  }
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  Crop.findById(req.params.id)
    .then(crop => {
      if (!crop) {
        return res.status(404).json({ message: 'Crop not found' });
      }
      const cropObject = crop.toObject();
      console.log('Crop data:', cropObject); // Add this line for debugging
      res.json(cropObject);
    })
    .catch(error => next(error));
});

export default router;