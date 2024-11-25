import { supabase } from '../services/supabaseClient';
import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

// Function to save the image locally
export const saveImageLocally = async (base64Image: string, fileName: string): Promise<string> => {
  const matches = base64Image.match(/^data:image\/(png|jpg|jpeg);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid Base64 format');
  }

  const imageBuffer = Buffer.from(matches[2], 'base64'); // Convert base64 to Buffer

  // Define local path (in a folder named "uploads" under the root of the project)
  const uploadsDir = path.join(__dirname, '../lpr-uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  const localImagePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(localImagePath, imageBuffer);

  return localImagePath; // Return the local file path
};

// Function to save image metadata to the database
export const getImage = (req: Request, res: Response) => {
    const filePath = path.join(__dirname, '../lpr-uploads', req.params.filename);
    console.log(filePath);
    // Check if the file exists before sending it
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        return res.status(404).json({ error: 'Image not found' });
      }
  
      // If the file exists, send it
      res.sendFile(filePath, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to send the image' });
        }
      });
    });
};