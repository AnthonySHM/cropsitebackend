import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db';
import cropRoutes from './routes/crops';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', authMiddleware as express.RequestHandler, cropRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the CropSite API' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});