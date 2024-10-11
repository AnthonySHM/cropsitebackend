"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const crops_1 = __importDefault(require("./routes/crops"));
const auth_1 = __importDefault(require("./routes/auth"));
const comments_1 = __importDefault(require("./routes/comments"));
const admin_1 = __importDefault(require("./routes/admin"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
(0, db_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/crops', crops_1.default); // Remove authMiddleware from here
app.use('/api/comments', comments_1.default);
app.use('/api/admin', admin_1.default);
// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the CropSite API' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use('/admin', admin_1.default);
