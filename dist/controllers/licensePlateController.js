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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLicensePlate = exports.createNewLicensePlate = void 0;
const licensePlatesService_1 = require("../services/licensePlatesService");
// Controller สำหรับสร้าง License Plate ใหม่
const createNewLicensePlate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // รับข้อมูลจาก Body
        const { licensePlateData, base64Image } = req.body;
        // ตรวจสอบข้อมูลที่ได้รับ
        if (!licensePlateData || !base64Image) {
            res.status(400).json({ message: 'License Plate data and image are required' });
        }
        // ตรวจสอบ lat, lon ถ้าต้องการให้ค่าเหล่านี้เป็นต้องมีค่าก็สามารถตรวจสอบได้ที่นี่
        if (licensePlateData.lon === undefined) {
            res.status(400).json({ message: 'Longitude (lon) is required' });
        }
        // สร้าง License Plate พร้อมกับบันทึก URL ของภาพ
        const data = yield (0, licensePlatesService_1.createLicensePlate)(licensePlateData, base64Image);
        if (!data) {
            res.status(400).json({ message: 'Failed to create license plate' });
        }
        // ส่งกลับข้อมูลเมื่อสำเร็จ
        res.status(201).json({
            message: 'License Plate created successfully',
            data: data,
        });
    }
    catch (error) {
        // ส่งข้อความ error เมื่อมีข้อผิดพลาด
        console.error(error); // เพิ่มการ log ข้อผิดพลาดเพื่อช่วยในการดีบั๊ก
        next(error); // ส่งข้อผิดพลาดไปยัง Error Handler
    }
});
exports.createNewLicensePlate = createNewLicensePlate;
// สร้าง License Plate ใหม่พร้อมกับบันทึกภาพ
const getAllLicensePlate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Call the service to get the license plates data
        const data = yield (0, licensePlatesService_1.getAllLicensePlatesFromDb)();
        if (!data || data.length === 0) {
            res.status(404).json({ message: 'No license plates found' });
        }
        res.status(200).json(data);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Unhandled error:', error);
        res.status(500).json({ error: errorMessage });
    }
});
exports.getAllLicensePlate = getAllLicensePlate;
