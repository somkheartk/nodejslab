import { Request, Response } from 'express';
import {   saveImageLocally,getImage } from '../services/galleryService';
import path from 'path';
import fs from 'fs';

export const uploadGalleryImage = async (req: Request, res: Response): Promise<void> => {
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
    const localImagePath = await saveImageLocally(base64Image, fileName);

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
  } catch (error: unknown) {
    // Ensure the error is an instance of Error
    if (error instanceof Error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: error.message });
    } else {
      // If error is not an instance of Error, handle accordingly
      console.error('Unknown error:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};
export const getGalleryImage = (req: Request, res: Response): void => { 
  const filePath = path.join(__dirname, '../lpr-uploads', req.params.filename);
  console.log(filePath);
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.sendFile(filePath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to send the image' });
      }
    });
  });
}



