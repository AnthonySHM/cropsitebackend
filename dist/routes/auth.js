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
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const router = express_1.default.Router();
const ADMIN_CREATION_KEY = process.env.ADMIN_CREATION_KEY || '1234567890';
router.post('/register', (req, res, next) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username, email, password, isAdmin, adminKey } = req.body;
            if (isAdmin && adminKey !== ADMIN_CREATION_KEY) {
                return res.status(403).json({ message: 'Invalid admin creation key' });
            }
            // Check if username or email already exists
            const existingUser = yield User_1.default.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                if (existingUser.username === username) {
                    return res.status(400).json({ message: 'Username already exists' });
                }
                if (existingUser.email === email) {
                    return res.status(400).json({ message: 'Email already exists' });
                }
            }
            const user = new User_1.default({ username, email, password, isAdmin: isAdmin || false });
            yield user.save();
            const token = (0, jwt_1.generateToken)(user);
            res.status(201).json({ token });
        }
        catch (error) {
            next(error);
        }
    }))();
});
router.post('/login', (req, res, next) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            User_1.default.findOne({ email }).then(user => {
                if (!user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                user.comparePassword(password).then(isMatch => {
                    if (!isMatch) {
                        return res.status(401).json({ message: 'Invalid email or password' });
                    }
                    const token = (0, jwt_1.generateToken)(user);
                    res.status(200).json({ token });
                });
            }).catch(error => {
                res.status(400).json({ message: 'Login failed' });
            });
        }
        catch (error) {
            next(error);
        }
    }))();
});
exports.default = router;
