import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String }
});

const VideoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String }
});

const CropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  overview: { type: String, required: true },
  overviewImages: [ImageSchema],
  overviewVideos: [VideoSchema],
  planting: { type: String, required: true },
  plantingImages: [ImageSchema],
  plantingVideos: [VideoSchema],
  care: { type: String, required: true },
  careImages: [ImageSchema],
  careVideos: [VideoSchema],
  harvest: { type: String, required: true },
  harvestImages: [ImageSchema],
  harvestVideos: [VideoSchema],
  economics: { type: String, required: true },
  economicsImages: [ImageSchema],
  economicsVideos: [VideoSchema],
  rating: { type: Number, default: 0, min: 0, max: 5 },
});

export default mongoose.model('Crop', CropSchema);
