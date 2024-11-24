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
exports.getAllLicensePlates = exports.createLicensePlate = void 0;
const supabaseClient_1 = require("../services/supabaseClient");
const createLicensePlate = (licensePlateData) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabaseClient_1.supabase
        .from('license_plates')
        .insert([licensePlateData]);
    if (error) {
        throw new Error(error.message);
    }
    return data;
});
exports.createLicensePlate = createLicensePlate;
const getAllLicensePlates = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabaseClient_1.supabase.from('license_plates').select('*');
    if (error) {
        throw new Error(error.message);
    }
    return data;
});
exports.getAllLicensePlates = getAllLicensePlates;
