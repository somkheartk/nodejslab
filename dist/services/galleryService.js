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
exports.getImage = exports.saveImageLocally = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Function to save the image locally
const saveImageLocally = (base64Image, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const matches = base64Image.match(/^data:image\/(png|jpg|jpeg);base64,(.+)$/);
    if (!matches) {
        throw new Error('Invalid Base64 format');
    }
    const imageBuffer = Buffer.from(matches[2], 'base64'); // Convert base64 to Buffer
    // Define local path (in a folder named "uploads" under the root of the project)
    const uploadsDir = path_1.default.join(__dirname, '../lpr-uploads');
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir);
    }
    const localImagePath = path_1.default.join(uploadsDir, fileName);
    fs_1.default.writeFileSync(localImagePath, imageBuffer);
    return localImagePath; // Return the local file path
});
exports.saveImageLocally = saveImageLocally;
// Function to save image metadata to the database
const getImage = (req, res) => {
    const filePath = path_1.default.join(__dirname, '../lpr-uploads', req.params.filename);
    console.log(filePath);
    // Check if the file exists before sending it
    fs_1.default.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).json({ error: 'Image not found' });
        }
        // If the file exists, send it
        res.sendFile(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to send the image' });
            }
        });
    });
};
exports.getImage = getImage;
