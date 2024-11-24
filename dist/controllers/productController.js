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
exports.createProduct = exports.getProducts = void 0;
const supabaseClient_1 = require("../services/supabaseClient");
// ดึงรายการ Products ทั้งหมด
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // เรียกข้อมูลจาก Supabase
        const { data, error } = yield supabaseClient_1.supabase.from('products').select('*');
        console.error(data);
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
    }
    catch (error) {
        // ตรวจสอบประเภทของข้อผิดพลาด
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Unhandled error:', error); // Log ข้อผิดพลาดเพิ่มเติม
        res.status(500).json({ error: errorMessage });
    }
});
exports.getProducts = getProducts;
// เพิ่ม Product ใหม่
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { data, error } = yield supabaseClient_1.supabase.from('products').insert([{ name, price }]);
        // จัดการข้อผิดพลาดจาก Supabase
        if (error) {
            console.error('Supabase error:', error.message); // Log ข้อผิดพลาด
            throw error;
        }
        // ส่งข้อมูลสินค้าใหม่กลับไป
        res.status(201).json(data);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Unhandled error:', error); // Log ข้อผิดพลาดเพิ่มเติม
        res.status(500).json({ error: errorMessage });
    }
});
exports.createProduct = createProduct;
