import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db';
import cropRoutes from './routes/crops';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/auth';
import commentRoutes from './routes/comments';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes); // Remove authMiddleware from here
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the CropSite API' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use('/admin', adminRoutes);