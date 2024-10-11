"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const VideoSchema = new mongoose_1.Schema({
    title: String,
    description: String,
    url: String,
});
const ImageSchema = new mongoose_1.Schema({
    url: String,
    caption: String,
});
const CropSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.default.model('Crop', CropSchema);
