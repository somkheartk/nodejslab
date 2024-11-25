"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const galleryController_1 = require("../controllers/galleryController");
const router = express_1.default.Router();
// Define the route for uploading gallery image
router.post('/upload', galleryController_1.uploadGalleryImage);
router.get('/images/:filename', (req, res) => {
    console.log(req.params.filename);
    // Implement your `getImage` service here
    (0, galleryController_1.getGalleryImage)(req, res);
});
exports.default = router;
