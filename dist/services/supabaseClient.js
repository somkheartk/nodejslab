"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
console.log(supabaseUrl);
console.log(supabaseKey);
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in .env');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
