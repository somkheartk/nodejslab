import { supabase } from '../services/supabaseClient';
import fs from 'fs';
import path from 'path';

// ฟังก์ชันแปลง base64 เป็นไฟล์แล้วอัปโหลดไปยัง Supabase Storage
export const uploadImageToSupabase = async (base64Image: string, fileName: string) => {
  // แยกส่วน base64 ออกจากข้อมูลที่เหลือ
  const matches = base64Image.match(/^data:image\/(png|jpg|jpeg);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid Base64 format');
  }

  const imageBuffer = Buffer.from(matches[2], 'base64'); // แปลง Base64 เป็น Buffer

  // อัปโหลดไฟล์ไปยัง Supabase Storage โดยตรงจาก Buffer
  const { data, error } = await supabase.storage
    .from('license-plate-images') // Bucket name
    .upload(fileName, imageBuffer, {
      cacheControl: '3600',
      upsert: true, // ถ้ามีไฟล์เดิมจะอัปเดต
    });

  if (error) {
    throw new Error(error.message);
  }

  // ใช้ getPublicUrl() เพื่อดึง URL ของไฟล์ที่อัปโหลด
  const fileUrl = supabase.storage
    .from('license-plate-images')
    .getPublicUrl(fileName).data.publicUrl;

  return fileUrl;
};

// ฟังก์ชันบันทึกข้อมูล License Plate พร้อมกับ URL ของภาพ
export const createLicensePlate = async (licensePlateData: any, base64Image: string) => {
  const fileName = `${Date.now()}.png`; // ตั้งชื่อไฟล์จากเวลา

  // อัปโหลดภาพไปยัง Supabase Storage และได้ URL กลับมา
  const imageUrl = await uploadImageToSupabase(base64Image, fileName);

  // บันทึกข้อมูล License Plate พร้อม URL ของภาพ
  const { data, error } = await supabase.from('license_plates').insert([
    {
      ...licensePlateData,
      image_url: imageUrl, // เพิ่ม URL ของภาพที่ได้จากการอัปโหลด
    },
  ]);

  console.log('Insert response:', { data, error });

  if (error) {
    throw new Error(error.message);
  }

  return data; // ส่งคืนข้อมูลที่บันทึกแล้ว
};

// ฟังก์ชันดึงข้อมูล License Plate ทั้งหมดจากฐานข้อมูล
export const getAllLicensePlatesFromDb = async () => {
  const { data, error } = await supabase.from('license_plates').select('*');

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  return data; // ส่งคืนข้อมูล License Plates
};
