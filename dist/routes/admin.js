"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Crop_1 = __importDefault(require("../models/Crop"));
const Comment_1 = __importDefault(require("../models/Comment"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authMiddleware);
// Get all crops
router.get('/crops', (req, res, next) => {
    Crop_1.default.find()
        .then(crops => res.json(crops))
        .catch(next);
});
// Get a single crop
router.get('/crops/:id', (req, res, next) => {
    Crop_1.default.findById(req.params.id)
        .then(crop => {
        if (!crop) {
            return res.status(404).json({ message: 'Crop not found' });
        }
        res.json(crop);
    })
        .catch(next);
});
// Create a new crop
router.post('/crops', auth_1.adminMiddleware, (req, res, next) => {
    const cropData = req.body;
    const requiredFields = ['name', 'overview', 'planting', 'care', 'harvest', 'economics'];
    const missingFields = requiredFields.filter(field => !cropData[field]);
    if (missingFields.length > 0) {
        res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        return;
    }
    const newCrop = new Crop_1.default(cropData);
    newCrop.save()
        .then(savedCrop => {
        res.status(201).json(savedCrop);
    })
        .catch(err => {
        console.error('Error saving crop:', err);
        if (err instanceof Error) {
            if (err.name === 'ValidationError') {
                res.status(400).json({ error: 'Validation Error', details: err.message });
            }
            else {
                res.status(500).json({ error: 'Failed to save crop', details: err.message });
            }
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    });
});
// Update a crop
router.put('/crops/:id', (req, res, next) => {
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
    Crop_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updatedCrop => {
        if (!updatedCrop) {
            return res.status(404).json({ message: 'Crop not found' });
        }
        res.json(updatedCrop);
    })
        .catch(next);
});
// Delete a crop
router.delete('/crops/:id', (req, res, next) => {
    Crop_1.default.findByIdAndDelete(req.params.id)
        .then(deletedCrop => {
        if (!deletedCrop) {
            return res.status(404).json({ message: 'Crop not found' });
        }
        res.json({ message: 'Crop deleted successfully' });
    })
        .catch(next);
});
// Add these routes for comment management
router.get('/comments', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield Comment_1.default.find().populate('user', 'username').populate('crop', 'name');
        const formattedComments = comments.map(comment => ({
            _id: comment._id,
            cropName: comment.crop ? comment.crop.name : 'Unknown Crop',
            section: comment.tab || 'Unknown Section',
            userName: comment.user ? comment.user.username : 'Unknown User',
            text: comment.content
        }));
        res.json(formattedComments);
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/comments/:id', (req, res, next) => {
    Comment_1.default.findByIdAndDelete(req.params.id)
        .then(comment => {
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.json({ message: 'Comment deleted successfully' });
    })
        .catch(next);
});
// GET /admin/users
router.get('/users', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({}, 'username email');
        res.json(users);
    }
    catch (error) {
        next(error);
    }
}));
// DELETE /admin/users/:id
router.delete('/users/:id', (req, res, next) => {
    User_1.default.findByIdAndDelete(req.params.id)
        .then(deletedUser => {
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    })
        .catch(next);
});
exports.default = router;
