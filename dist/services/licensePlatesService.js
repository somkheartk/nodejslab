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
exports.getAllLicensePlatesFromDb = exports.createLicensePlate = exports.uploadImageToSupabase = void 0;
const supabaseClient_1 = require("../services/supabaseClient");
// ฟังก์ชันแปลง base64 เป็นไฟล์แล้วอัปโหลดไปยัง Supabase Storage
const uploadImageToSupabase = (base64Image, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    // แยกส่วน base64 ออกจากข้อมูลที่เหลือ
    const matches = base64Image.match(/^data:image\/(png|jpg|jpeg);base64,(.+)$/);
    if (!matches) {
        throw new Error('Invalid Base64 format');
    }
    const imageBuffer = Buffer.from(matches[2], 'base64'); // แปลง Base64 เป็น Buffer
    // อัปโหลดไฟล์ไปยัง Supabase Storage โดยตรงจาก Buffer
    const { data, error } = yield supabaseClient_1.supabase.storage
        .from('license-plate-images') // Bucket name
        .upload(fileName, imageBuffer, {
        cacheControl: '3600',
        upsert: true, // ถ้ามีไฟล์เดิมจะอัปเดต
    });
    if (error) {
        throw new Error(error.message);
    }
    // ใช้ getPublicUrl() เพื่อดึง URL ของไฟล์ที่อัปโหลด
    const fileUrl = supabaseClient_1.supabase.storage
        .from('license-plate-images')
        .getPublicUrl(fileName).data.publicUrl;
    return fileUrl;
});
exports.uploadImageToSupabase = uploadImageToSupabase;
// ฟังก์ชันบันทึกข้อมูล License Plate พร้อมกับ URL ของภาพ
const createLicensePlate = (licensePlateData, base64Image) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = `${Date.now()}.png`; // ตั้งชื่อไฟล์จากเวลา
    // อัปโหลดภาพไปยัง Supabase Storage และได้ URL กลับมา
    const imageUrl = yield (0, exports.uploadImageToSupabase)(base64Image, fileName);
    // บันทึกข้อมูล License Plate พร้อม URL ของภาพ
    const { data, error } = yield supabaseClient_1.supabase.from('license_plates').insert([
        Object.assign(Object.assign({}, licensePlateData), { image_url: imageUrl }),
    ]);
    console.log('Insert response:', { data, error });
    if (error) {
        throw new Error(error.message);
    }
    return data; // ส่งคืนข้อมูลที่บันทึกแล้ว
});
exports.createLicensePlate = createLicensePlate;
// ฟังก์ชันดึงข้อมูล License Plate ทั้งหมดจากฐานข้อมูล
const getAllLicensePlatesFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabaseClient_1.supabase.from('license_plates').select('*');
    if (error) {
        throw new Error(`Supabase error: ${error.message}`);
    }
    return data; // ส่งคืนข้อมูล License Plates
});
exports.getAllLicensePlatesFromDb = getAllLicensePlatesFromDb;
