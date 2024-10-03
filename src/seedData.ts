import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Crop from './models/Crop';
import { connectDB } from './db';

dotenv.config();

interface CropData {
  name: string;
  image: string;
  overview: string;
  overviewImages: Array<{ url: string; caption: string }>;
  overviewVideos: Array<{ url: string; title: string; description?: string }>;
  planting: string;
  plantingImages: Array<{ url: string; caption: string }>;
  plantingVideos: Array<{ url: string; title: string; description?: string }>;
  care: string;
  careImages: Array<{ url: string; caption: string }>;
  careVideos: Array<{ url: string; title: string; description?: string }>;
  harvest: string;
  harvestImages: Array<{ url: string; caption: string }>;
  harvestVideos: Array<{ url: string; title: string; description?: string }>;
  economics: string;
  economicsImages: Array<{ url: string; caption: string }>;
  economicsVideos: Array<{ url: string; title: string; description?: string }>;
  rating: number;
}

const seedData: CropData[] = [
  {
    name: 'Wheat',
    image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg',
    overview: 'Wheat is a staple grain crop grown worldwide for its versatile uses in food production.',
    overviewImages: [
      { url: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg', caption: 'Wheat field at sunset' },
      { url: 'https://images.pexels.com/photos/533982/pexels-photo-533982.jpeg', caption: 'Close-up of wheat grains' },
    ],
    overviewVideos: [
      { url: 'https://www.youtube.com/watch?v=9qXLLNEUejs', title: 'How It\'s Made: Wheat', description: 'Discovery of how wheat is produced and processed' },
    ],
    planting: 'Plant wheat seeds 1-2 inches deep in rows, with 4-6 inches between each seed.',
    plantingImages: [
      { url: 'https://images.pexels.com/photos/2255459/pexels-photo-2255459.jpeg', caption: 'Planting wheat seeds' },
    ],
    plantingVideos: [
      { url: 'https://www.youtube.com/watch?v=y8kKc-MdDM8', title: 'How to Plant Wheat', description: 'Step-by-step guide on planting wheat' },
    ],
    care: 'Water regularly and apply fertilizer as needed. Monitor for pests and diseases.',
    careImages: [
      { url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg', caption: 'Irrigating wheat fields' },
    ],
    careVideos: [
      { url: 'https://www.youtube.com/watch?v=KM6tUzmBxoQ', title: 'Wheat Crop Management', description: 'Best practices for caring for wheat crops' },
    ],
    harvest: 'Harvest wheat when the stalks turn golden and the grains are hard.',
    harvestImages: [
      { url: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg', caption: 'Combine harvester in action' },
    ],
    harvestVideos: [
      { url: 'https://www.youtube.com/watch?v=335c-tZ3N5E', title: 'Wheat Harvesting', description: 'Modern techniques for harvesting wheat' },
    ],
    economics: 'Wheat is a major global commodity with applications in various food industries.',
    economicsImages: [
      { url: 'https://images.pexels.com/photos/1797505/pexels-photo-1797505.jpeg', caption: 'Global wheat trade' },
    ],
    economicsVideos: [
      { url: 'https://www.youtube.com/watch?v=PJfiN1ULrVo', title: 'The Economics of Wheat', description: 'Understanding the global wheat market' },
    ],
    rating: 4.5
  },
  {
    name: 'Corn',
    image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg',
    overview: 'Corn, also known as maize, is a versatile crop used for food, feed, and fuel production.',
    overviewImages: [
      { url: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg', caption: 'Corn field at sunset' },
      { url: 'https://images.pexels.com/photos/1459331/pexels-photo-1459331.jpeg', caption: 'Close-up of corn ears' },
    ],
    overviewVideos: [
      { url: 'https://www.youtube.com/watch?v=xWOxWzT6Zqw', title: 'The Life Cycle of Corn', description: 'From seed to harvest: the corn growth process' },
    ],
    planting: 'Plant corn seeds 1-2 inches deep in rows, with 4-6 inches between each seed.',
    plantingImages: [
      { url: 'https://images.pexels.com/photos/2255459/pexels-photo-2255459.jpeg', caption: 'Planting corn seeds' },
    ],
    plantingVideos: [
      { url: 'https://www.youtube.com/watch?v=oGn-ARGRTgc', title: 'How to Plant Corn', description: 'Step-by-step guide to planting corn' },
    ],
    care: 'Water regularly, especially during tasseling. Apply fertilizer and control weeds.',
    careImages: [
      { url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg', caption: 'Irrigating corn fields' },
    ],
    careVideos: [
      { url: 'https://www.youtube.com/watch?v=ckYrG6bUbJ8', title: 'Corn Crop Management', description: 'Essential tips for caring for your corn crop' },
    ],
    harvest: 'Harvest corn when the kernels are fully developed and the silks have turned brown.',
    harvestImages: [
      { url: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg', caption: 'Combine harvester in corn field' },
    ],
    harvestVideos: [
      { url: 'https://www.youtube.com/watch?v=bt1XEz0p8TI', title: 'Corn Harvesting Process', description: 'Modern techniques for harvesting corn' },
    ],
    economics: 'Corn is a major crop with diverse applications in food, feed, and biofuel industries.',
    economicsImages: [
      { url: 'https://images.pexels.com/photos/1797505/pexels-photo-1797505.jpeg', caption: 'Global corn trade' },
    ],
    economicsVideos: [
      { url: 'https://www.youtube.com/watch?v=xebZWeOEpY0', title: 'The Economics of Corn', description: 'Understanding the corn market and its impact' },
    ],
    rating: 4.5
  },
  {
    name: 'Rice',
    image: 'https://images.pexels.com/photos/1241532/pexels-photo-1241532.jpeg',
    overview: 'Rice is a staple food for more than half of the world\'s population, particularly in Asia.',
    overviewImages: [
      { url: 'https://images.pexels.com/photos/1241532/pexels-photo-1241532.jpeg', caption: 'Terraced rice fields' },
      { url: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg', caption: 'Close-up of rice grains' }
    ],
    overviewVideos: [
      { url: 'https://www.youtube.com/watch?v=kxAEiHCErSA', title: 'Rice Farming', description: 'Overview of rice cultivation techniques' },
    ],
    planting: 'Sow rice seeds in flooded paddies or transplant seedlings into flooded fields.',
    plantingImages: [
      { url: 'https://images.pexels.com/photos/2255459/pexels-photo-2255459.jpeg', caption: 'Planting rice seedlings' },
    ],
    plantingVideos: [
      { url: 'https://www.youtube.com/watch?v=kRnK8xI3PY4', title: 'How to Plant Rice', description: 'Traditional and modern methods of planting rice' },
    ],
    care: 'Maintain water levels, control weeds, and apply fertilizer as needed.',
    careImages: [
      { url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg', caption: 'Managing water levels in rice paddy' },
    ],
    careVideos: [
      { url: 'https://www.youtube.com/watch?v=H7g-n-3xshc', title: 'Rice Crop Management', description: 'Essential tips for caring for your rice crop' },
    ],
    harvest: 'Harvest rice when the grains are mature and the plants have turned golden-brown.',
    harvestImages: [
      { url: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg', caption: 'Harvesting rice with combine' },
    ],
    harvestVideos: [
      { url: 'https://www.youtube.com/watch?v=_TgqZaZmqM4', title: 'Rice Harvesting Process', description: 'Various methods of harvesting rice' },
    ],
    economics: 'Rice is a crucial food crop and an important part of the economy in many countries.',
    economicsImages: [
      { url: 'https://images.pexels.com/photos/1797505/pexels-photo-1797505.jpeg', caption: 'Global rice trade' },
    ],
    economicsVideos: [
      { url: 'https://www.youtube.com/watch?v=efNF1eODN4g', title: 'The Economics of Rice', description: 'Understanding the global rice market' },
    ],
    rating: 4.7
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await Crop.deleteMany({});
    await Crop.insertMany(seedData);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();