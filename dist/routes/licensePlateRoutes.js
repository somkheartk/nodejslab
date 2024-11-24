"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const licensePlateController_1 = require("../controllers/licensePlateController");
const router = (0, express_1.Router)();
// Route to create a new license plate record
router.post('/create', licensePlateController_1.createLicensePlate);
router.get('/all', licensePlateController_1.getAllLicensePlates);
exports.default = router;
