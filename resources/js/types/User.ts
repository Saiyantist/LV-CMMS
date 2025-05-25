// src/types/User.ts
export interface User {
    id: number;
    first_name: string;
    last_name: string;
    contact_number: string;
    // birth_date: Date; // Accepts both Date and string for flexibility
    gender: "male" | "female"; // Restrict to valid gender options
    staff_type: string;
    email: string;
    profile_photo_url?: string; // Optional with safe fallback
    [key: string]: any; // Allows additional dynamic properties
}
