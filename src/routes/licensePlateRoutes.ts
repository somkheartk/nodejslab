import express from 'express';
import { createNewLicensePlate } from '../controllers/licensePlateController';

const router = express.Router();

// Route สำหรับสร้าง License Plate พร้อมบันทึกภาพ
router.post('/create', createNewLicensePlate);
export default router;
