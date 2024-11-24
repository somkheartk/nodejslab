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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLicensePlatesFromDb = exports.createLicensePlate = exports.uploadImageToSupabase = void 0;
const supabaseClient_1 = require("../services/supabaseClient");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// ฟังก์ชันแปลง base64 เป็นไฟล์แล้วบันทึกใน Supabase Storage
const uploadImageToSupabase = (base64Image, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    // แยกส่วนที่เป็น base64 ออกจากข้อมูลที่เหลือ
    const matches = base64Image.match(/^data:image\/(png|jpg|jpeg);base64,(.+)$/);
    if (!matches) {
        throw new Error('Invalid Base64 format');
    }
    const imageBuffer = Buffer.from(matches[2], 'base64'); // แปลง Base64 เป็น Buffer
    // สร้างไฟล์ชั่วคราวในระบบ
    const tempFilePath = path_1.default.join(__dirname, '../temp', fileName);
    fs_1.default.writeFileSync(tempFilePath, imageBuffer);
    // อัปโหลดไฟล์ไปยัง Supabase Storage
    const { data, error } = yield supabaseClient_1.supabase.storage
        .from('license-plate-images') // ชื่อ Bucket
        .upload(fileName, fs_1.default.createReadStream(tempFilePath), {
        cacheControl: '3600',
        upsert: true, // ถ้ามีไฟล์เดิมแล้วจะอัปเดตใหม่,
        duplex: 'half', // Specify duplex option here
    });
    if (error) {
        throw new Error(error.message);
    }
    // ลบไฟล์ชั่วคราวออก
    fs_1.default.unlinkSync(tempFilePath);
    // ใช้ publicUrl แทน publicURL
    const fileUrl = supabaseClient_1.supabase.storage.from('license-plate-images').getPublicUrl(fileName).data.publicUrl;
    return fileUrl;
});
exports.uploadImageToSupabase = uploadImageToSupabase;
// ฟังก์ชันบันทึกข้อมูล License Plate พร้อมกับ URL ของภาพ
const createLicensePlate = (licensePlateData, base64Image) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = `${Date.now()}.png`; // ตั้งชื่อไฟล์จากเวลา
    // อัปโหลดภาพไปยัง Supabase Storage
    const imageUrl = yield (0, exports.uploadImageToSupabase)(base64Image, fileName);
    // บันทึกข้อมูล License Plate พร้อม URL ของภาพ
    const { data, error } = yield supabaseClient_1.supabase.from('license_plates').insert([
        Object.assign(Object.assign({}, licensePlateData), { image_url: imageUrl }),
    ]);
    if (error) {
        throw new Error(error.message);
    }
    return data;
});
exports.createLicensePlate = createLicensePlate;
const getAllLicensePlatesFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabaseClient_1.supabase.from('license_plates').select('*');
    if (error) {
        throw new Error(`Supabase error: ${error.message}`);
    }
    return data;
});
exports.getAllLicensePlatesFromDb = getAllLicensePlatesFromDb;
