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
exports.getGalleryImage = exports.uploadGalleryImage = void 0;
const galleryService_1 = require("../services/galleryService");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadGalleryImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { base64Image, lat, lon, locationName } = req.body;
        // Validate input
        if (!base64Image || !lat || !lon || !locationName) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        // Generate a unique filename based on timestamp
        const fileName = `${Date.now()}.png`;
        // Save the image locally
        const localImagePath = yield (0, galleryService_1.saveImageLocally)(base64Image, fileName);
        // Upload the image to Supabase Storage and get image URL
        // const fileName = `${Date.now()}.png`;
        const imageUrl = `https://localhost:5000/lpr-uploads/${fileName}`; // Replace this with the actual image URL
        // Save image metadata to Supabase database
        // const metadata = await saveImageMetadata(imageUrl, lat, lon, locationName);
        // Return the response
        res.status(200).json({
            message: 'Image uploaded successfully',
            data: '',
            localImagePath,
            imageUrl,
        });
    }
    catch (error) {
        // Ensure the error is an instance of Error
        if (error instanceof Error) {
            console.error('Error uploading image:', error);
            res.status(500).json({ error: error.message });
        }
        else {
            // If error is not an instance of Error, handle accordingly
            console.error('Unknown error:', error);
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});
exports.uploadGalleryImage = uploadGalleryImage;
const getGalleryImage = (req, res) => {
    const filePath = path_1.default.join(__dirname, '../lpr-uploads', req.params.filename);
    console.log(filePath);
    fs_1.default.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.sendFile(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to send the image' });
            }
        });
    });
};
exports.getGalleryImage = getGalleryImage;
