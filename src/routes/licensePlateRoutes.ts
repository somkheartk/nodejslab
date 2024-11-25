import express from 'express';
import { createNewLicensePlate,getAllLicensePlate } from '../controllers/licensePlateController';

const router = express.Router();

// Route สำหรับสร้าง License Plate พร้อมบันทึกภาพ
router.post('/create', createNewLicensePlate);
router.get('/all', getAllLicensePlate);

export default router;
