import express, { Application } from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import licensePlateRoutes from './routes/licensePlateRoutes';


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/products', productRoutes);
app.use('/licenseplages', licensePlateRoutes); // ตั้งเส้นทางหลักให้กับ license plate routes


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
