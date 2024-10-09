import mongoose, { Schema, Document } from 'mongoose';

interface IVideo {
  title: string;
  description: string;
  url: string;
}

interface IImage {
  url: string;
  caption: string;
}

export interface ICrop extends Document {
  name: string;
  image: string;
  overview: string;
  planting: string;
  care: string;
  harvest: string;
  economics: string;
  rating: number; // Add this line
  videos: {
    [key: string]: IVideo[];
  };
  images: {
    [key: string]: IImage[];
  };
}

const VideoSchema = new Schema({
  title: String,
  description: String,
  url: String,
});

const ImageSchema = new Schema({
  url: String,
  caption: String,
});

const CropSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  overview: { type: String, required: true },
  planting: { type: String, required: true },
  care: { type: String, required: true },
  harvest: { type: String, required: true },
  economics: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 }, // Add this line
  videos: {
    overview: [VideoSchema],
    planting: [VideoSchema],
    care: [VideoSchema],
    harvest: [VideoSchema],
    economics: [VideoSchema],
  },
  images: {
    overview: [ImageSchema],
    planting: [ImageSchema],
    care: [ImageSchema],
    harvest: [ImageSchema],
    economics: [ImageSchema],
  },
});

export default mongoose.model<ICrop>('Crop', CropSchema);