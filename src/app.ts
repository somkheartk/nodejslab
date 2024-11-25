import express, { Application } from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import licensePlateRoutes from './routes/licensePlateRoutes';
import galleryRoutes from './routes/galleryRoutes';
import path from 'path';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.static('public'))
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Routes
app.use('/products', productRoutes);
app.use('/licenseplages', licensePlateRoutes); // ตั้งเส้นทางหลักให้กับ license plate routes
app.use('/gallery', galleryRoutes);
app.use('/lpr-uploads', express.static(path.join(__dirname, 'lpr-uploads')));
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
