// src/types/licensePlate.ts
export interface LicensePlate {
    license_plate: string;
    color: string;
    model: string;
    brand: string;
    image_url: string;
    lat?: number; // Optional field
    lon?: number; // Optional field
    user_id: number;
    make: string;
  }
  