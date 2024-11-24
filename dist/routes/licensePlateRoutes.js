"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const licensePlateController_1 = require("../controllers/licensePlateController");
const router = express_1.default.Router();
// Route สำหรับสร้าง License Plate พร้อมบันทึกภาพ
router.post('/create', licensePlateController_1.createNewLicensePlate);
exports.default = router;
