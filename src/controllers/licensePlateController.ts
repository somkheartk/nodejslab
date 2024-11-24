import { Request, Response, NextFunction } from 'express';
import { createLicensePlate,getAllLicensePlatesFromDb } from '../services/licensePlatesService';

// กำหนดประเภทของข้อมูลที่รับจาก request
interface LicensePlateData {
  license_plate: string;
  color: string;
  model: string;
  brand: string;
  make: string;
  lat?: number;
  lon?: number;  // Optional field for longitude
  user_id: number;
}

// Controller สำหรับสร้าง License Plate ใหม่
export const createNewLicensePlate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // รับข้อมูลจาก Body
    const { licensePlateData, base64Image }: { licensePlateData: LicensePlateData, base64Image: string } = req.body;

    // ตรวจสอบข้อมูลที่ได้รับ
    if (!licensePlateData || !base64Image) {
       res.status(400).json({ message: 'License Plate data and image are required' });
    }

    // ตรวจสอบ lat, lon ถ้าต้องการให้ค่าเหล่านี้เป็นต้องมีค่าก็สามารถตรวจสอบได้ที่นี่
    if (licensePlateData.lon === undefined) {
       res.status(400).json({ message: 'Longitude (lon) is required' });
    }

    // สร้าง License Plate พร้อมกับบันทึก URL ของภาพ
    const data = await createLicensePlate(licensePlateData, base64Image);

    if (!data) {
       res.status(400).json({ message: 'Failed to create license plate' });
    }

    // ส่งกลับข้อมูลเมื่อสำเร็จ
     res.status(201).json({
      message: 'License Plate created successfully',
      data: data,
    });
  } catch (error: any) {
    // ส่งข้อความ error เมื่อมีข้อผิดพลาด
    console.error(error);  // เพิ่มการ log ข้อผิดพลาดเพื่อช่วยในการดีบั๊ก
    next(error); // ส่งข้อผิดพลาดไปยัง Error Handler
  }
};
// สร้าง License Plate ใหม่พร้อมกับบันทึกภาพ
export const getAllLicensePlate = async (req: Request, res: Response): Promise<void> => {
  try {
    // Call the service to get the license plates data
    const data = await getAllLicensePlatesFromDb();
    if (!data || data.length === 0) {
       res.status(404).json({ message: 'No license plates found' });
    }
    res.status(200).json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Unhandled error:', error);
    res.status(500).json({ error: errorMessage });
  }
};