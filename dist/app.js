"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const licensePlateRoutes_1 = __importDefault(require("./routes/licensePlateRoutes"));
const galleryRoutes_1 = __importDefault(require("./routes/galleryRoutes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.static('public'));
app.use(express_1.default.json({ limit: '100mb' }));
app.use(express_1.default.urlencoded({ limit: '100mb', extended: true }));
// Routes
app.use('/api/products', productRoutes_1.default);
app.use('/licenseplages', licensePlateRoutes_1.default); // ตั้งเส้นทางหลักให้กับ license plate routes
app.use('/gallery', galleryRoutes_1.default);
app.use('/lpr-uploads', express_1.default.static(path_1.default.join(__dirname, 'lpr-uploads')));
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
