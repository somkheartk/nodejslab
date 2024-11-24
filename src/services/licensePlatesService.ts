import { supabase } from '../services/supabaseClient';
import fs from 'fs';
import path from 'path';

// ฟังก์ชันแปลง base64 เป็นไฟล์แล้วบันทึกใน Supabase Storage
export const uploadImageToSupabase = async (base64Image: string, fileName: string) => {
  // แยกส่วนที่เป็น base64 ออกจากข้อมูลที่เหลือ
  const matches = base64Image.match(/^data:image\/(png|jpg|jpeg);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid Base64 format');
  }

  const imageBuffer = Buffer.from(matches[2], 'base64'); // แปลง Base64 เป็น Buffer

  // สร้างไฟล์ชั่วคราวในระบบ
  const tempFilePath = path.join(__dirname, '../temp', fileName);
  fs.writeFileSync(tempFilePath, imageBuffer);

  // อัปโหลดไฟล์ไปยัง Supabase Storage
  const { data, error } = await supabase.storage
    .from('license-plate-images') // ชื่อ Bucket
    .upload(fileName, fs.createReadStream(tempFilePath), {
      cacheControl: '3600',
      upsert: true, // ถ้ามีไฟล์เดิมแล้วจะอัปเดตใหม่
    });

  if (error) {
    throw new Error(error.message);
  }

  // ลบไฟล์ชั่วคราวออก
  fs.unlinkSync(tempFilePath);

  // ใช้ publicUrl แทน publicURL
  const fileUrl = supabase.storage.from('license-plate-images').getPublicUrl(fileName).data.publicUrl;
  return fileUrl;
};

// ฟังก์ชันบันทึกข้อมูล License Plate พร้อมกับ URL ของภาพ
export const createLicensePlate = async (licensePlateData: any, base64Image: string) => {
  const fileName = `${Date.now()}.png`; // ตั้งชื่อไฟล์จากเวลา

  // อัปโหลดภาพไปยัง Supabase Storage
  const imageUrl = await uploadImageToSupabase(base64Image, fileName);

  // บันทึกข้อมูล License Plate พร้อม URL ของภาพ
  const { data, error } = await supabase.from('license_plates').insert([
    {
      ...licensePlateData,
      image_url: imageUrl,
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
export const getAllLicensePlatesFromDb = async () => {
    const { data, error } = await supabase.from('license_plates').select('*');
  
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
  
    return data;
  };