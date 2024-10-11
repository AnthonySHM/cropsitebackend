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
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const Crop_1 = __importDefault(require("./models/Crop"));
const db_1 = require("./db");
dotenv_1.default.config();
const PIXABAY_API_KEY = "46339207-8e3b19c7aa4a736e6c29abdcc";
const PIXABAY_API_URL = 'https://pixabay.com/api/';
const YOUTUBE_API_KEY = 'AIzaSyCFX39qQAJextYqrNT8zR37gfOttj4ht8Q';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
const crops = [
    "Tomato", "Potato", "Carrot", "Lettuce", "Cucumber"
];
function fetchImages(query_1) {
    return __awaiter(this, arguments, void 0, function* (query, count = 5) {
        try {
            const response = yield axios_1.default.get(PIXABAY_API_URL, {
                params: {
                    key: PIXABAY_API_KEY,
                    q: query,
                    per_page: count,
                    image_type: 'photo',
                },
            });
            return response.data.hits;
        }
        catch (error) {
            console.error(`Error fetching images for ${query}:`, error);
            return [];
        }
    });
}
function fetchYouTubeVideos(query_1) {
    return __awaiter(this, arguments, void 0, function* (query, count = 10) {
        var _a;
        try {
            const response = yield axios_1.default.get(YOUTUBE_API_URL, {
                params: {
                    part: 'snippet',
                    q: query,
                    type: 'video',
                    maxResults: count,
                    key: YOUTUBE_API_KEY,
                },
            });
            return response.data.items;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error(`Error fetching YouTube videos for ${query}:`, (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
            }
            else {
                console.error(`Error fetching YouTube videos for ${query}:`, error);
            }
            return [];
        }
    });
}
function generateExtensiveOverview(cropName) {
    return `
${cropName} is a versatile and widely cultivated crop that plays a significant role in global agriculture and cuisine. 

Origin and History:
${cropName} has a rich history dating back thousands of years. It is believed to have originated in [region], where it was first domesticated around [time period]. Since then, it has spread across the globe and has been adapted to various climates and growing conditions.

Botanical Characteristics:
${cropName} belongs to the [family name] family. It is typically an annual plant, growing to a height of [height range]. The plant produces [description of leaves, flowers, and fruits/vegetables].

Nutritional Value:
${cropName} is known for its nutritional benefits. It is rich in [list of vitamins and minerals]. It also contains [other beneficial compounds] which have been associated with various health benefits, including [list of potential health benefits].

Culinary Uses:
${cropName} is a versatile ingredient in many cuisines around the world. It can be eaten raw, cooked, or processed into various products. Common culinary uses include [list of common uses].

Agricultural Importance:
As a major crop, ${cropName} contributes significantly to global food security and agricultural economies. It is grown in [list of major producing countries/regions] and plays a crucial role in both subsistence farming and large-scale commercial agriculture.

Varieties:
There are numerous varieties of ${cropName}, each bred for specific characteristics such as flavor, size, disease resistance, or adaptability to different climates. Some popular varieties include [list of popular varieties].

This overview provides a foundation for understanding the importance and versatility of ${cropName} in agriculture and human consumption.
  `;
}
function generateSeedData() {
    return __awaiter(this, void 0, void 0, function* () {
        const seedData = [];
        for (const crop of crops) {
            const images = yield fetchImages(crop, 10);
            if (images.length === 0)
                continue;
            const videoCategories = ['overview', 'planting', 'care', 'harvest', 'economics'];
            const videos = {};
            for (const category of videoCategories) {
                try {
                    const fetchedVideos = yield fetchYouTubeVideos(`${crop} farming ${category}`, 1);
                    videos[category] = fetchedVideos.length > 0 ? fetchedVideos[0] : null;
                }
                catch (error) {
                    console.error(`Error fetching ${category} video for ${crop}:`, error);
                    videos[category] = null;
                }
            }
            const mapVideo = (video) => video ? {
                url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                title: video.snippet.title,
                description: video.snippet.description
            } : null;
            seedData.push({
                name: crop,
                image: images[0].webformatURL,
                overview: generateExtensiveOverview(crop),
                overviewImages: images.slice(0, 3).map(img => ({ url: img.webformatURL, caption: img.tags })),
                overviewVideos: [mapVideo(videos.overview)].filter((v) => v !== null),
                planting: `Planting ${crop} involves careful preparation of soil, consideration of climate conditions, and proper timing. [Add more detailed planting information here]`,
                plantingImages: images.slice(3, 5).map(img => ({ url: img.webformatURL, caption: `${crop} planting process` })),
                plantingVideos: [mapVideo(videos.planting)].filter((v) => v !== null),
                care: `${crop} requires regular care, including watering, fertilization, and protection from pests and diseases. [Add more detailed care information here]`,
                careImages: images.slice(5, 7).map(img => ({ url: img.webformatURL, caption: `${crop} plant care` })),
                careVideos: [mapVideo(videos.care)].filter((v) => v !== null),
                harvest: `Harvesting ${crop} at the right time ensures optimal quality and yield. [Add more detailed harvesting information here]`,
                harvestImages: images.slice(7, 9).map(img => ({ url: img.webformatURL, caption: `${crop} harvest` })),
                harvestVideos: [mapVideo(videos.harvest)].filter((v) => v !== null),
                economics: `${crop} is an economically important crop with significant market demand and value. [Add more detailed economic information here]`,
                economicsImages: [{ url: images[9].webformatURL, caption: `${crop} in agriculture` }],
                economicsVideos: [mapVideo(videos.economics)].filter((v) => v !== null),
                rating: Number((Math.random() * (5 - 3) + 3).toFixed(1)),
            });
        }
        return seedData;
    });
}
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        const seedData = yield generateSeedData();
        yield Crop_1.default.deleteMany({});
        yield Crop_1.default.insertMany(seedData);
        console.log('Database seeded successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
});
seedDatabase();
