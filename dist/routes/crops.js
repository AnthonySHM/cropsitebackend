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
const router = express_1.default.Router();
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, minRating } = req.query;
        let query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (minRating) {
            query.rating = { $gte: parseFloat(minRating) };
        }
        const crops = yield Crop_1.default.find(query).select('name image rating');
        const cropsWithDefaultRating = crops.map(crop => (Object.assign(Object.assign({}, crop.toObject()), { rating: crop.rating || 0 // Set default rating to 0 if it's undefined
         })));
        console.log('Found crops:', cropsWithDefaultRating);
        res.json(cropsWithDefaultRating);
    }
    catch (error) {
        console.error('Error in /crops route:', error);
        next(error);
    }
}));
router.get('/:id', (req, res, next) => {
    Crop_1.default.findById(req.params.id)
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
exports.default = router;
