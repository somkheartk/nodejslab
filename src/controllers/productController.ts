import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';

// ดึงรายการ Products ทั้งหมด
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // เรียกข้อมูลจาก Supabase
    const { data, error } = await supabase.from('products').select('*');
    console.error(data)
    // จัดการข้อผิดพลาดจาก Supabase
    if (error) {
      console.error('Supabase error:', error.message); // Log ข้อผิดพลาด
      throw error;
    }

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (!data || data.length === 0) {
      res.status(404).json({ message: 'No products found' });
      return;
    }

    // ส่งข้อมูลกลับไปที่ผู้เรียก API
    res.status(200).json(data);
  } catch (error) {
    // ตรวจสอบประเภทของข้อผิดพลาด
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Unhandled error:', error); // Log ข้อผิดพลาดเพิ่มเติม
    res.status(500).json({ error: errorMessage });
  }
};

// เพิ่ม Product ใหม่
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price } = req.body;

    // ตรวจสอบว่า name และ price มีข้อมูลหรือไม่
    if (!name || !price) {
      res.status(400).json({ error: 'Name and price are required' });
      return;
    }

    // ตรวจสอบว่า price เป็นตัวเลข
    if (isNaN(price)) {
      res.status(400).json({ error: 'Price must be a number' });
      return;
    }

    // เพิ่มข้อมูลสินค้า
    const { data, error } = await supabase.from('products').insert([{ name, price }]);
    
    // จัดการข้อผิดพลาดจาก Supabase
    if (error) {
      console.error('Supabase error:', error.message); // Log ข้อผิดพลาด
      throw error;
    }

    // ส่งข้อมูลสินค้าใหม่กลับไป
    res.status(201).json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Unhandled error:', error); // Log ข้อผิดพลาดเพิ่มเติม
    res.status(500).json({ error: errorMessage });
  }
};
