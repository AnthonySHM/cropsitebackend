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
const Comment_1 = __importDefault(require("../models/Comment"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get comments for a specific crop and tab (no authentication required)
router.get('/:cropId/:tab', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cropId, tab } = req.params;
        const comments = yield Comment_1.default.find({ crop: cropId, tab })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(comments);
    }
    catch (error) {
        next(error);
    }
}));
// Add a new comment (authentication required)
router.post('/', auth_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cropId, tab, content } = req.body;
        const userId = req.user.id; // Get the user ID from the auth middleware
        const newComment = new Comment_1.default({
            user: userId,
            crop: cropId,
            tab,
            content
        });
        yield newComment.save();
        res.status(201).json(newComment);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
