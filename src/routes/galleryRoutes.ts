import express from 'express';
import { uploadGalleryImage,getGalleryImage } from '../controllers/galleryController';

const router = express.Router();

// Define the route for uploading gallery image
router.post('/upload', uploadGalleryImage);
router.get('/images/:filename', (req, res) => {
    console.log(req.params.filename);
    // Implement your `getImage` service here
    getGalleryImage(req, res);
  });
export default router;
